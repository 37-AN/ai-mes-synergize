// Re-export database configuration and utilities
export * from './dbConfig';

// Common types for database operations
export interface ProductionMetric {
  id: number;
  timestamp: Date;
  lineId: string;
  productId: string;
  quantity: number;
  qualityScore: number;
  cycleTime: number;
  energyConsumption: number;
}

export interface MachineStatus {
  id: number;
  timestamp: Date;
  machineId: string;
  status: 'operational' | 'warning' | 'critical';
  temperature: number;
  pressure: number;
  vibration: number;
  lastMaintenance: Date;
  predictedMaintenance: Date;
}

export interface AIRecommendation {
  id: number;
  timestamp: Date;
  type: 'optimization' | 'maintenance' | 'quality' | 'scheduling';
  priority: 'low' | 'medium' | 'high';
  description: string;
  expectedImpact: string;
  confidence: number;
}

// Database query helper types
export type QueryOptions = {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  filters?: Record<string, any>;
};

// Error types for database operations
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public query?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ConnectionError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
  }
} 