import { config } from 'mssql';

// Export a type alias for the mssql configuration type.
export type SqlConfig = config;

// Export an instance of the configuration.
// (Update any properties as needed for your environment.)
export const sqlConfig: SqlConfig = {
  user: 'sa',
  password: 'Pa$$w0rd',
  database: 'MES_DB',
  server: '43V3R\\FVRSERVER',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};
