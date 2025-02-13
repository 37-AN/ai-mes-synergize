import * as mssql from 'mssql';
import { environment } from '../config/environment';
import { ConnectionError, DatabaseError } from './errors';

export interface SqlConfig extends mssql.config {
  options: mssql.config['options'] & {
    encrypt: boolean;
    trustServerCertificate: boolean;
  };
  pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
  };
}

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
    } catch (error) {
      throw new ConnectionError(`Failed to connect to database: ${(error as Error).message}`);
    }
  }

  get pool(): mssql.ConnectionPool | null {
    return this._pool;
  }

  get connected(): boolean {
    return this._pool?.connected || false;
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
      throw new DatabaseError(
        `Query execution failed: ${(error as Error).message}`,
        (error as any).code,
        queryString
      );
    }
  }

  async close(): Promise<void> {
    if (this._pool) {
      await this._pool.close();
      this._pool = null;
    }
  }
}

export const sqlConfig: SqlConfig = {
  user: environment.database.user,
  password: environment.database.password,
  database: environment.database.name,
  server: environment.database.server,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: environment.database.maxPoolSize,
    min: environment.database.minPoolSize,
    idleTimeoutMillis: environment.database.idleTimeout
  }
};

export const db = Database.getInstance(); 