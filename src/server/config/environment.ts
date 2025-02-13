interface DatabaseConfig {
  user: string;
  password: string;
  name: string;
  server: string;
  maxPoolSize: number;
  minPoolSize: number;
  idleTimeout: number;
}

interface Environment {
  production: boolean;
  apiUrl: string;
  database: DatabaseConfig;
}

const env = process.env;

export const environment: Environment = {
  production: env.NODE_ENV === 'production',
  apiUrl: env.API_URL || 'http://localhost:3000',
  database: {
    user: env.DB_USER || 'sa',
    password: env.DB_PASSWORD || 'Pa$$w0rd',
    name: env.DB_NAME || 'MES_DB',
    server: env.DB_SERVER || '43V3R\\FVRSERVER',
    maxPoolSize: parseInt(env.DB_MAX_POOL || '10'),
    minPoolSize: parseInt(env.DB_MIN_POOL || '0'),
    idleTimeout: parseInt(env.DB_IDLE_TIMEOUT || '30000')
  }
}; 