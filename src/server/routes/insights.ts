import { Router, Request, Response, NextFunction } from 'express';
import { insightService } from '../services/aiInsightService';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const insights = await insightService.generateInsights();
    res.json(insights);
  } catch (error) {
    next(error);
  }
});

export { router }; 