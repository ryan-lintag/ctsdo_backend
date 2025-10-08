import express from 'express';
import {
  submitTicket,
  respondToTicket,
  submitPublicTicket, // 👈 import the new controller
} from '../controllers/auth/supportController.js';

const router = express.Router();

router.post('/tickets', submitTicket); // authenticated applicants
router.post('/tickets/respond/:id', respondToTicket); // for admin replies

// 👇 NEW route for unauthenticated users (landing page)
router.post('/contact-public', submitPublicTicket);

export default router;
