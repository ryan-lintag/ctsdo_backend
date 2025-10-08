import express from 'express';
import { register } from '../controllers/auth/registerController.js';
import { login, logout } from '../controllers/auth/LoginController.js';
import { verifyEmail } from '../controllers/auth/verifyEmail.js';
import { requestPasswordReset, resetPassword } from '../controllers/auth/passwordResetController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

export default router;
