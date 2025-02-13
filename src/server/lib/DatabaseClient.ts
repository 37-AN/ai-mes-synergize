import sql from 'mssql';
import type { config as SqlConfig } from 'mssql';
import { sqlConfig } from '../../utils/dbConfig';

export class DatabaseClient {
  private static _instance: DatabaseClient;
  private _pool: sql.ConnectionPool | null = null;
  private _config: SqlConfig;

  private constructor(config: SqlConfig) {
    this._config = config;
  }

  static getInstance(config: SqlConfig): DatabaseClient {
    if (!DatabaseClient._instance) {
      DatabaseClient._instance = new DatabaseClient(config);
    }
    return DatabaseClient._instance;
  }

  async connect(): Promise<sql.ConnectionPool> {
    try {
      if (!this._pool) {
        this._pool = await new sql.ConnectionPool(this._config).connect();
        console.log('Connected to database');
      }
      return this._pool;
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  }

  async query<T>(queryString: string, params: Record<string, any> = {}): Promise<T[]> {
    try {
      const pool = await this.connect();
      const request = pool.request();
      
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });

      const result = await request.query(queryString);
      return result.recordset;
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this._pool) {
      await this._pool.close();
      this._pool = null;
    }
  }

  get connected(): boolean {
    return this._pool?.connected || false;
  }
}

// Previously, you exported DatabaseService, which doesn't define "query"
// export const dbClient = DatabaseService;

// Fix: export an instance of DatabaseClient so that dbClient.query exists.
export const dbClient = DatabaseClient.getInstance(sqlConfig);