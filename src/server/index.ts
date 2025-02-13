
import express from 'express';
import cors from 'cors';
import { dbClient } from './lib/DatabaseClient';
import { router as insightsRouter } from './routes/insights';
import { handleServerError } from './middleware/errorHandler';
import { status } from './lib/status';
import { simulationLogs } from './lib/logs';
import './lib/simulator';

const app = express();
const port = process.env.PORT || 8081;

async function startServer() {
  try {
    app.use(cors({
      origin: 'http://localhost:8080',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    app.use(express.json());

    // Health check endpoint
    app.get('/health', async (_req, res) => {
      try {
        await dbClient.connect();
        res.json({ status: 'ok', dbConnected: dbClient.connected });
      } catch (error) {
        res.status(503).json({ status: 'error', dbConnected: false });
      }
    });

    // API routes
    app.use('/api/insights', insightsRouter);

    // Status endpoint
    app.get('/api/status', (_req, res) => {
      res.json({
        dbConnection: dbClient.connected,
        simulationRunning: status.simulationRunning,
      });
    });

    // Logs endpoint
    app.get('/api/logs', (_req, res) => {
      res.json(simulationLogs);
    });

    // Error handling
    app.use(handleServerError);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
