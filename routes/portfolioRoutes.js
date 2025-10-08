import express from 'express';
import { getPortfolio, updatePortfolio, getPublicPortfolio } from '../controllers/portfolioController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

// Get student portfolio (protected route)
router.get('/:studentId', checkAuth, getPortfolio);

// Update student portfolio (protected route)
router.put('/:studentId', checkAuth, updatePortfolio);

// Get public portfolio (for sharing - no auth required)
router.get('/public/:studentId', getPublicPortfolio);

export default router;