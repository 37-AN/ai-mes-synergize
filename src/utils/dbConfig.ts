import * as mssql from 'mssql';
import { ConnectionError, DatabaseError } from './errors';
import { config } from 'mssql';

export class Database {
  private static instance: Database | null = null;
  private _pool: mssql.ConnectionPool | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<mssql.ConnectionPool> {
    try {
      if (!this._pool) {
        this._pool = await new mssql.ConnectionPool(sqlConfig).connect();
        console.log('Connected to database');
      }
      return this._pool;
    } catch (err) {
      const error = err as Error;
      throw new ConnectionError(`Failed to connect to database: ${error.message}`);
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
    } catch (err) {
      const error = err as Error;
      throw new DatabaseError(
        `Query execution failed: ${error.message}`,
        (error as any).code,
        queryString
      );
    }
  }

  async close(): Promise<void> {
    try {
      if (this._pool) {
        await this._pool.close();
        this._pool = null;
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error closing connection:', error.message);
    }
  }

  get connected(): boolean {
    return this._pool?.connected || false;
  }
}

export const sqlConfig: config = {
  user: 'sa',
  password: 'Pa$$w0rd',
  database: 'MES_DB',
  server: '43V3R\\FVRSERVER',
  options: {
    encrypt: true,
    trustServerCertificate: true, // For local development only
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000, // Use idleTimeoutMillis, not idleTimeout
  },
};

export const db = Database.getInstance();

// Enhanced connection testing with diagnostics
export const testConnection = async (): Promise<boolean> => {
  try {
    // Create a new connection pool
    const pool = await new mssql.ConnectionPool(sqlConfig).connect();
    console.log('Database connected successfully');
    await pool.close();
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
};
