import { ProductionMetrics, MaintenancePrediction, ProductionOptimization } from '../../types/ai';
import * as tf from '@tensorflow/tfjs-node';
import { DatabaseError } from '../utils/errors';

interface CriticalParameters {
  temperature: number;
  vibration: number;
  [key: string]: number;
}

class AIAnalyticsService {
  private models: Map<string, tf.LayersModel> = new Map();

  async initialize() {
    try {
      // Load pre-trained models
      this.models.set('maintenance', await tf.loadLayersModel('file://./models/maintenance/model.json'));
      this.models.set('quality', await tf.loadLayersModel('file://./models/quality/model.json'));
      this.models.set('optimization', await tf.loadLayersModel('file://./models/optimization/model.json'));
    } catch (error) {
      console.error('Failed to load AI models:', error);
      throw new Error('AI Model initialization failed');
    }
  }

  async predictMaintenance(metrics: ProductionMetrics[]): Promise<MaintenancePrediction> {
    const model = this.models.get('maintenance');
    if (!model) throw new Error('Maintenance model not loaded');

    try {
      const input = this.prepareMaintenanceData(metrics);
      const prediction = await model.predict(input) as tf.Tensor;
      const values = (await prediction.array()) as number[][];

      return {
        equipmentId: metrics[0].lineId,
        predictedFailureTime: this.calculateFailureTime(values[0]),
        confidence: values[0][1],
        remainingLife: values[0][2],
        recommendedActions: this.getMaintenanceRecommendations(values[0]),
        criticalParameters: this.identifyCriticalParameters(metrics)
      };
    } catch (error) {
      const err = error as Error;
      throw new DatabaseError('Maintenance prediction failed', err.name);
    }
  }

  async optimizeProduction(metrics: ProductionMetrics[]): Promise<ProductionOptimization> {
    const model = this.models.get('optimization');
    if (!model) throw new Error('Optimization model not loaded');

    try {
      const input = this.prepareOptimizationData(metrics);
      const prediction = await model.predict(input) as tf.Tensor;
      const values = (await prediction.array()) as number[][];

      return {
        lineId: metrics[0].lineId,
        recommendedSettings: this.calculateOptimalSettings(values[0]),
        expectedImprovements: {
          quality: values[0][0],
          output: values[0][1],
          energy: values[0][2]
        },
        confidence: values[0][3]
      };
    } catch (error) {
      const err = error as Error;
      throw new DatabaseError('Production optimization failed', err.name);
    }
  }

  private prepareMaintenanceData(metrics: ProductionMetrics[]): tf.Tensor {
    return tf.tensor(metrics.map(m => [
      m.temperature,
      m.pressure,
      m.vibration,
      m.cycleTime,
      ...Object.values(m.parameters)
    ]));
  }

  private prepareOptimizationData(metrics: ProductionMetrics[]): tf.Tensor {
    return tf.tensor(metrics.map(m => [
      m.cycleTime,
      m.quality,
      m.output,
      m.energy,
      ...Object.values(m.parameters)
    ]));
  }

  private calculateFailureTime(prediction: number[]): Date {
    const hoursToFailure = prediction[0] * 168;
    return new Date(Date.now() + hoursToFailure * 3600000);
  }

  private getMaintenanceRecommendations(prediction: number[]): string[] {
    const recommendations: string[] = [];
    if (prediction[3] > 0.8) recommendations.push('Immediate maintenance required');
    if (prediction[4] > 0.6) recommendations.push('Schedule preventive maintenance');
    return recommendations;
  }

  private identifyCriticalParameters(metrics: ProductionMetrics[]): Record<string, number> {
    return metrics.reduce((acc: CriticalParameters, m) => ({
      ...acc,
      temperature: Math.max(acc.temperature || 0, m.temperature),
      vibration: Math.max(acc.vibration || 0, m.vibration)
    }), { temperature: 0, vibration: 0 });
  }

  private calculateOptimalSettings(prediction: number[]): Record<string, number> {
    return {
      speed: prediction[4],
      temperature: prediction[5],
      pressure: prediction[6]
    };
  }
}

export const aiAnalytics = new AIAnalyticsService(); 