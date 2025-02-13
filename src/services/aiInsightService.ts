
import { AIInsight } from '@/types/ai';
import { environment } from '@/config/environment';
import { MockAIInsightService } from './mockAIInsightService';
import { aiAnalytics } from './aiAnalyticsService';
import { dbClient } from '@/server/lib/DatabaseClient';

export class AIInsightService {
  static async generateInsights(): Promise<AIInsight[]> {
    try {
      if (!environment.production) {
        return await MockAIInsightService.generateInsights();
      }

      const [metrics, status] = await Promise.all([
        this.getProductionMetrics(),
        this.getMachineStatus()
      ]);

      const insights: AIInsight[] = [];

      // Generate maintenance predictions
      const maintenancePrediction = await aiAnalytics.predictMaintenance(metrics);
      if (maintenancePrediction.remainingLife < 168) { // Less than 1 week
        insights.push({
          type: 'prediction',
          message: `Maintenance required for ${maintenancePrediction.equipmentId} within ${Math.ceil(maintenancePrediction.remainingLife)} hours`,
          impact: `Prevent potential downtime of ${Math.ceil(maintenancePrediction.remainingLife)} hours`
        });
      }

      // Detect anomalies
      const anomalies = await aiAnalytics.detectAnomalies(metrics);
      for (const anomaly of anomalies) {
        if (anomaly.value > 0.8) {
          insights.push({
            type: 'alert',
            message: `Anomaly detected at ${anomaly.timestamp.toLocaleString()}`,
            impact: `Confidence: ${(anomaly.confidence * 100).toFixed(1)}%`
          });
        }
      }

      // Generate optimization recommendations
      const optimization = await aiAnalytics.optimizeProduction(metrics);
      if (optimization.expectedImprovements.quality > 0.05) {
        insights.push({
          type: 'optimization',
          message: 'Process optimization available',
          impact: `Potential ${(optimization.expectedImprovements.quality * 100).toFixed(1)}% quality improvement`
        });
      }

      return insights;
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      return [];
    }
  }

  private static async getProductionMetrics() {
    return dbClient.query(`
      SELECT TOP 100 *
      FROM ProductionMetrics
      ORDER BY Timestamp DESC
    `);
  }

  private static async getMachineStatus() {
    return dbClient.query(`
      SELECT TOP 50 *
      FROM MachineStatus
      ORDER BY Timestamp DESC
    `);
  }
}
