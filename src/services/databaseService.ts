
import sql from 'mssql';
import { sqlConfig } from '../utils/dbConfig';

export class DatabaseService {
  private static pool: sql.ConnectionPool | null = null;

  private static async getConnection() {
    if (!this.pool) {
      this.pool = await new sql.ConnectionPool(sqlConfig).connect();
    }
    return this.pool;
  }

  static async getProductionMetrics() {
    try {
      const pool = await this.getConnection();
      const result = await pool.request()
        .query(`
          SELECT TOP 10 *
          FROM ProductionMetrics
          ORDER BY Timestamp DESC
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error fetching production metrics:', error);
      throw error;
    }
  }

  static async getMachineStatus() {
    try {
      const pool = await this.getConnection();
      const result = await pool.request()
        .query(`
          SELECT TOP 10 *
          FROM MachineStatus
          ORDER BY Timestamp DESC
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error fetching machine status:', error);
      throw error;
    }
  }
}
