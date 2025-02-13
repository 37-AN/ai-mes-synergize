const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Simulation logs with color-coded alerts
const simulationLogs = [
  { timestamp: new Date().toISOString(), message: 'System initialized', alertColor: 'green' },
  { timestamp: new Date().toISOString(), message: 'Data validation complete', alertColor: 'green' }
];

// Simulated AI insights (this should eventually be replaced by actual AI model outputs)
const aiInsights = [
  { id: 1, insight: 'Predictive maintenance: Machine A requires service in 3 hours.' },
  { id: 2, insight: 'Efficiency gain: Production throughput increased by 12%.' },
  { id: 3, insight: 'Quality alert: Minor anomaly detected in batch #245.' }
];

// Dummy data quality report from an AI-driven data cleaning process
const dataQualityReport = {
  totalRecords: 10000,
  anomaliesDetected: 45,
  outliersRemoved: 10,
  correctionsMade: 30,
  status: 'Good'
};

// Smart decision recommendations (sample data)
const smartDecisions = [
  { id: 1, recommendation: 'Optimize machine runtime by increasing cycle by 5%.' },
  { id: 2, recommendation: 'Reschedule maintenance for Machine B during off-peak hours.' }
];

// System status object with visual indicators (e.g., color alerts)
const systemStatus = {
  dbConnection: true,          // Update based on actual DB connection status
  simulationRunning: true,     // Update dynamically from your simulator
  alertColor: 'green'          // Default: green; will be updated below
};

// Helper function to update alert color based on status values
function updateSystemStatus() {
  if (!systemStatus.dbConnection || !systemStatus.simulationRunning) {
    systemStatus.alertColor = 'red';
  } else {
    systemStatus.alertColor = 'green';
  }
}

// Helper to serve static files (like index.html for your frontend)
function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

// Create HTTP server and define API endpoints
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const route = parsedUrl.pathname;

  // Real-time status endpoint with visual indicators
  if (route === '/api/status') {
    updateSystemStatus();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(systemStatus));
  }
  // Simulation logs endpoint (with color-coded alerts)
  else if (route === '/api/logs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(simulationLogs));
  }
  // AI-driven insights endpoint
  else if (route === '/api/ai-insights') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(aiInsights));
  }
  // Data quality report endpoint (for AI-enhanced data cleaning)
  else if (route === '/api/data-quality') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(dataQualityReport));
  }
  // Smart decision/recommendation endpoint (for AI-powered automation)
  else if (route === '/api/smart-decisions') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(smartDecisions));
  }
  else {
    // For any other request, serve the frontend index.html (adjust the path as needed)
    const indexPath = path.join(__dirname, 'public', 'index.html');
    return serveFile(indexPath, 'text/html', res);
  }
});

// Update backend port to 8081 to avoid conflict with your frontend dev server (running on 8080)
const port = process.env.PORT || 8081;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
