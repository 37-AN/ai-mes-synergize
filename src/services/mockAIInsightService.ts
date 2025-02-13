import { AIInsight } from '@/types/ai';

export class MockAIInsightService {
  static async generateInsights(): Promise<AIInsight[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
      {
        type: "optimization",
        message: "Production efficiency dropped by 7.5%. Suggested adjustments: Optimize line speed, check for bottlenecks",
        impact: "Potential 7.5% efficiency improvement"
      },
      {
        type: "prediction",
        message: "Machine M1001 maintenance needed in 48 hours",
        impact: "Prevent potential 8h downtime"
      },
      {
        type: "alert",
        message: "Quality issues detected: Line A quality score: 92%",
        impact: "Quality score impact: -4%"
      }
    ];
  }
} 