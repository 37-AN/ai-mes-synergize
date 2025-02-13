import { AIInsight } from '../../types/ai';
import { dbClient } from '../lib/DatabaseClient';
import { DatabaseError } from '../utils/errors';

interface ProductionMetrics {
  timestamp: Date;
  lineId: string;
  output: number;
  quality: number;
  efficiency: number;
}

interface MachineStatus {
  machineId: string;
  status: 'operational' | 'warning' | 'critical';
  lastMaintenance: Date;
  metrics: {
    temperature: number;
    vibration: number;
    pressure: number;
  };
}

class InsightService {
  async generateInsights(): Promise<AIInsight[]> {
    let pool;
    try {
      pool = await dbClient.connect();
      
      // Get data
      const [metrics, status] = await Promise.all([
        this.getProductionMetrics(),
        this.getMachineStatus()
      ]);

      // Generate insights
      const insights: AIInsight[] = [];

      // Add efficiency insights
      const efficiency = await this.analyzeEfficiency(metrics);
      if (efficiency) insights.push(efficiency);

      // Add maintenance predictions
      const maintenance = await this.predictMaintenance(status);
      insights.push(...maintenance);

      // Add quality alerts
      const quality = await this.analyzeQuality(metrics);
      if (quality) insights.push(quality);

      return insights;
    } catch (error) {
      const err = error as Error;
      throw new DatabaseError('Failed to generate insights', err.name);
    } finally {
      if (pool) {
        await dbClient.close();
      }
    }
  }

  private async getProductionMetrics(): Promise<ProductionMetrics[]> {
    return dbClient.query<ProductionMetrics>(`
      SELECT TOP 100 *
      FROM ProductionMetrics
      ORDER BY timestamp DESC
    `);
  }

  private async getMachineStatus(): Promise<MachineStatus[]> {
    return dbClient.query<MachineStatus>(`
      SELECT TOP 50 *
      FROM MachineStatus
      ORDER BY timestamp DESC
    `);
  }

  private async analyzeEfficiency(metrics: ProductionMetrics[]): Promise<AIInsight | null> {
    const avgEfficiency = metrics.reduce((sum, m) => sum + m.efficiency, 0) / metrics.length;
    if (avgEfficiency < 0.85) {
      return {
        type: "optimization",
        message: `Production efficiency below target: ${(avgEfficiency * 100).toFixed(1)}%`,
        impact: "Potential 15% efficiency improvement"
      };
    }
    return null;
  }

  private async predictMaintenance(status: MachineStatus[]): Promise<AIInsight[]> {
    return status
      .filter(s => s.metrics.temperature > 80 || s.metrics.vibration > 0.5)
      .map(s => ({
        type: "prediction",
        message: `Machine ${s.machineId} requires maintenance`,
        impact: "Prevent potential downtime"
      }));
  }

  private async analyzeQuality(metrics: ProductionMetrics[]): Promise<AIInsight | null> {
    const avgQuality = metrics.reduce((sum, m) => sum + m.quality, 0) / metrics.length;
    if (avgQuality < 0.95) {
      return {
        type: "alert",
        message: `Quality below target: ${(avgQuality * 100).toFixed(1)}%`,
        impact: "Quality improvement needed"
      };
    }
    return null;
  }
}

export const insightService = new InsightService(); 