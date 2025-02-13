export const environment = {
  production: process.env.PROD === 'true',
  apiUrl: process.env.VITE_API_URL || 'http://localhost:3000',
  database: {
    server: '43V3R\\FVRSERVER',
    database: 'MES_DB',
    user: 'sa',
    password: 'Pa$$w0rd'
  },
  auth: {
    enabled: true,
    tokenExpiryMinutes: 60
  },
  features: {
    aiPredictions: true,
    realTimeMonitoring: true,
    automaticAlerts: true
  }
};
