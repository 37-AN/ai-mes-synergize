import sql from 'mssql';
import type { config as SqlConfig } from 'mssql';
import { sqlConfig } from '../../utils/dbConfig';

export class DatabaseClient {
  private _pool: sql.ConnectionPool | null = null;
  private _config: SqlConfig;

  constructor(config: SqlConfig) {
    this._config = config;
  }

  async connect(): Promise<sql.ConnectionPool> {
    if (!this._pool) {
      try {
        this._pool = await new sql.ConnectionPool(this._config).connect();
        console.log('Database connected.');
      } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
      }
    }
    return this._pool;
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
      console.error('Query error:', error);
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
    // The pool exists if the connection was successful.
    return this._pool !== null;
  }
}

// Create and export a single instance of DatabaseClient
export const dbClient = new DatabaseClient(sqlConfig);