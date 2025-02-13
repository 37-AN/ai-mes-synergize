import { AIInsight } from '@/types/ai';
import { environment } from '@/config/environment';

export class APIService {
  private static baseUrl = environment.apiUrl;

  static async getAIInsights(): Promise<AIInsight[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/insights`);
      if (!response.ok) throw new Error('Failed to fetch insights');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
} 