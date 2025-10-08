import express from 'express';
import {
  update,
} from '../controllers/auth/userController.js';

const router = express.Router();

router.put('/:id', update);

export default router;
