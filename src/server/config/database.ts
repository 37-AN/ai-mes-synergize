require('dotenv').config();

export const sqlServerConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Pa$$w0rd',
  database: process.env.DB_NAME || 'MES_DB',
  server: process.env.DB_SERVER || 'localhost',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: process.env.DB_INSTANCE || 'SQLEXPRESS'
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}; 