
import { config } from 'mssql';

export const sqlConfig: config = {
  user: 'administrator',
  password: 'Pa$$w0rd',
  database: 'MES_DB',
  server: 'localhost',
  options: {
    encrypt: true,
    trustServerCertificate: true, // For local dev only
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Database connection helper
export const testConnection = async () => {
  const sql = require('mssql');
  try {
    await sql.connect(sqlConfig);
    console.log('Database connected successfully');
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
};
