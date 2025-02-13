import express, { Request, Response } from 'express';
import cors from 'cors';
import { dbClient } from './lib/DatabaseClient';
import { router as insightsRouter } from './routes/insights';
import { handleServerError } from './middleware/errorHandler';
import { status } from '../server/lib/status';
import './lib/simulator';

const app = express();
const port = process.env.PORT || 8080;

async function startServer() {
  try {
    app.use(cors());
    app.use(express.json());

    // Health check endpoint
    app.get('/health', async (_req: Request, res: Response) => {
      try {
        await dbClient.connect();
        res.json({ status: 'ok', dbConnected: dbClient.connected });
        await dbClient.close();
      } catch (error) {
        res.status(503).json({ status: 'error', dbConnected: false });
      }
    });

    // API routes
    app.use('/api/insights', insightsRouter);

    // API endpoint to return DB connection and simulation status
    app.get('/api/status', (_req, res) => {
      res.json({
        dbConnection: dbClient.connected,
        simulationRunning: status.simulationRunning,
      });
    });

    // Error handling
    app.use(handleServerError);

    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle cleanup on shutdown
process.on('SIGTERM', async () => {
  try {
    await dbClient.close();
    console.log('Database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer(); 