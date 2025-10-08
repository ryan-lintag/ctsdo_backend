import express from 'express';
import { searchJobsWithAI, getJobMarketInsights } from '../controllers/auth/jobMatchingController.js';
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

// Search jobs using ChatGPT AI
router.post('/search', checkAuth, searchJobsWithAI);

// Get job market insights
router.post('/insights', checkAuth, getJobMarketInsights);

export default router;