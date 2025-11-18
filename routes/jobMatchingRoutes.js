import express from 'express';
import { searchJobsWithAI } from '../controllers/auth/jobMatchingController.js';
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

// Search jobs using ChatGPT AI
router.post('/search', checkAuth, searchJobsWithAI)

export default router;