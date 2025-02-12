
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  database: {
    server: 'localhost',
    database: 'MES_DB',
    user: 'administrator',
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
