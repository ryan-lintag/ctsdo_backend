import express from 'express';
import { getCounts } from '../controllers/auth/adminDashboardController.js';
import { getRegistrationsByMonth } from '../controllers/auth/registrationController.js';
import { getApplicationsByMonth } from '../controllers/auth/applicationController.js';

const router = express.Router();

// Dashboard counts
router.get('/counts', getCounts);

// Registrations per month (Bar Chart)
router.get('/registrations', getRegistrationsByMonth);

// Applications per month (Point Chart)
router.get('/applications', getApplicationsByMonth);

export default router;
