
import { ProductionMetrics, MaintenancePrediction, ProductionOptimization } from '../types/ai';
import * as tf from '@tensorflow/tfjs-node';
import { DatabaseError } from '../server/utils/errors';

interface AnalyticsPrediction {
  timestamp: Date;
  value: number;
  confidence: number;
  recommendations: string[];
}

export class AIAnalyticsService {
  private models: Map<string, tf.LayersModel> = new Map();
  private readonly modelPaths = {
    maintenance: 'maintenance',
    quality: 'quality',
    optimization: 'optimization',
    anomaly: 'anomaly'
  };

  async initialize() {
    try {
      await Promise.all([
        this.loadModel('maintenance'),
        this.loadModel('quality'),
        this.loadModel('optimization'),
        this.loadModel('anomaly')
      ]);
      console.log('AI models initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI models:', error);
      throw new Error('AI Model initialization failed');
    }
  }

  private async loadModel(type: keyof typeof this.modelPaths) {
    try {
      const model = await tf.loadLayersModel(`file://./models/${this.modelPaths[type]}/model.json`);
      this.models.set(type, model);
    } catch (error) {
      console.error(`Failed to load ${type} model:`, error);
      throw error;
    }
  }

  async predictMaintenance(metrics: ProductionMetrics[]): Promise<MaintenancePrediction> {
    const model = this.models.get('maintenance');
    if (!model) throw new Error('Maintenance model not loaded');

    try {
      const input = this.prepareMaintenanceData(metrics);
      const prediction = await model.predict(input) as tf.Tensor;
      const values = await prediction.array() as number[][];

      const criticalParameters = this.analyzeParameters(metrics);
      const recommendations = this.generateMaintenanceRecommendations(values[0], criticalParameters);

      return {
        equipmentId: metrics[0].lineId,
        predictedFailureTime: this.calculateFailureTime(values[0][0]),
        confidence: values[0][1],
        remainingLife: values[0][2],
        recommendedActions: recommendations,
        criticalParameters
      };
    } catch (error) {
      throw new DatabaseError('Maintenance prediction failed', error.name);
    }
  }

  async detectAnomalies(metrics: ProductionMetrics[]): Promise<AnalyticsPrediction[]> {
    const model = this.models.get('anomaly');
    if (!model) throw new Error('Anomaly detection model not loaded');

    try {
      const input = this.prepareAnomalyData(metrics);
      const predictions = await model.predict(input) as tf.Tensor;
      const values = await predictions.array() as number[][];

      return values.map((value, index) => ({
        timestamp: new Date(metrics[index].timestamp),
        value: value[0],
        confidence: value[1],
        recommendations: this.generateAnomalyRecommendations(value)
      }));
    } catch (error) {
      throw new DatabaseError('Anomaly detection failed', error.name);
    }
  }

  async optimizeProduction(metrics: ProductionMetrics[]): Promise<ProductionOptimization> {
    const model = this.models.get('optimization');
    if (!model) throw new Error('Optimization model not loaded');

    try {
      const input = this.prepareOptimizationData(metrics);
      const prediction = await model.predict(input) as tf.Tensor;
      const values = await prediction.array() as number[][];

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
      throw new DatabaseError('Production optimization failed', error.name);
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

  private prepareAnomalyData(metrics: ProductionMetrics[]): tf.Tensor {
    return tf.tensor(metrics.map(m => [
      m.temperature,
      m.pressure,
      m.vibration,
      m.quality,
      m.output,
      m.energy,
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

  private calculateFailureTime(hoursToFailure: number): Date {
    return new Date(Date.now() + hoursToFailure * 3600000);
  }

  private analyzeParameters(metrics: ProductionMetrics[]): Record<string, number> {
    const latestMetrics = metrics[0];
    return {
      temperature: latestMetrics.temperature,
      pressure: latestMetrics.pressure,
      vibration: latestMetrics.vibration,
      ...latestMetrics.parameters
    };
  }

  private generateMaintenanceRecommendations(prediction: number[], parameters: Record<string, number>): string[] {
    const recommendations: string[] = [];
    
    if (prediction[0] < 168) { // Less than 1 week
      recommendations.push('Schedule immediate maintenance check');
    }
    
    if (parameters.temperature > 80) {
      recommendations.push('High temperature detected - Check cooling system');
    }
    
    if (parameters.vibration > 0.5) {
      recommendations.push('Excessive vibration - Inspect bearings and alignment');
    }

    return recommendations;
  }

  private generateAnomalyRecommendations(prediction: number[]): string[] {
    const recommendations: string[] = [];
    const anomalyScore = prediction[0];
    const confidence = prediction[1];

    if (anomalyScore > 0.8 && confidence > 0.9) {
      recommendations.push('Critical anomaly detected - Immediate attention required');
    } else if (anomalyScore > 0.6) {
      recommendations.push('Potential issue detected - Schedule inspection');
    }

    return recommendations;
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
