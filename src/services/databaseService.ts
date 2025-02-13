import sql from 'mssql';
import { sqlConfig } from '../utils/dbConfig';

export class DatabaseService {
  private static pool: sql.ConnectionPool | null = null;

  /**
   * Initializes (or returns) an existing connection pool.
   */
  public static async getConnection(): Promise<sql.ConnectionPool> {
    if (!DatabaseService.pool) {
      DatabaseService.pool = await new sql.ConnectionPool(sqlConfig).connect();
    }
    return DatabaseService.pool;
  }

  /**
   * Connects to the database using the underlying pool.
   */
  public static async connect(): Promise<sql.ConnectionPool> {
    return await DatabaseService.getConnection();
  }

  /**
   * Getter to check if the database connection is already established.
   */
  public static get connected(): boolean {
    return DatabaseService.pool !== null;
  }

  /**
   * Closes the database connection and resets the connection pool.
   */
  public static async close(): Promise<void> {
    if (DatabaseService.pool) {
      await DatabaseService.pool.close();
      DatabaseService.pool = null;
    }
  }

  /**
   * Example method: Fetches production metrics from the database.
   */
  public static async getProductionMetrics(): Promise<any[]> {
    try {
      const pool = await DatabaseService.getConnection();
      const result = await pool.request().query(`
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
