import { AIInsight } from '@/types/ai';
import { environment } from '@/config/environment';
import { MockAIInsightService } from './mockAIInsightService';
import { APIService } from './api';

export class AIInsightService {
  static async generateInsights(): Promise<AIInsight[]> {
    try {
      // Use mock service for development
      if (!environment.production) {
        return await MockAIInsightService.generateInsights();
      }
      
      // Use real API for production
      return await APIService.getAIInsights();
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      return [];
    }
  }
} 