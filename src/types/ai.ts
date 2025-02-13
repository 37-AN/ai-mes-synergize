export interface AIInsight {
  type: "optimization" | "prediction" | "alert";
  message: string;
  impact: string;
}

export interface AIModelConfig {
  modelType: 'prediction' | 'optimization' | 'anomaly' | 'scheduling';
  parameters: Record<string, any>;
  threshold: number;
  confidence: number;
}

export interface AIAnalysis {
  timestamp: Date;
  modelType: AIModelConfig['modelType'];
  prediction: any;
  confidence: number;
  recommendations: string[];
  metadata: Record<string, any>;
}

export interface ProductionMetrics {
  lineId: string;
  timestamp: Date;
  cycleTime: number;
  quality: number;
  output: number;
  energy: number;
  temperature: number;
  pressure: number;
  vibration: number;
  parameters: Record<string, number>;
}

export interface MaintenancePrediction {
  equipmentId: string;
  predictedFailureTime: Date;
  confidence: number;
  remainingLife: number;
  recommendedActions: string[];
  criticalParameters: Record<string, number>;
}

export interface ProductionOptimization {
  lineId: string;
  recommendedSettings: Record<string, number>;
  expectedImprovements: {
    quality: number;
    output: number;
    energy: number;
  };
  confidence: number;
} 