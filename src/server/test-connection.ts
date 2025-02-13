import * as mssql from 'mssql';
import { sqlConfig } from './utils/dbConfig';

async function testDatabaseConnection(): Promise<boolean> {
  try {
    const pool = await new mssql.ConnectionPool(sqlConfig).connect();
    console.log('Successfully connected to database');
    await pool.close();
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
}

testDatabaseConnection().catch(console.error); 