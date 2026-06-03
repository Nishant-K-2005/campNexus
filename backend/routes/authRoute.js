import express from 'express';
import { signup, login, session, logout } from '../controllers/authController.js';
import protect from '../middleware/protect.js';
import validate from '../middleware/validate.js';
import { loginSchema, signupSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/signup',validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/session', protect, session);
router.post('/logout',protect, logout)

export default router;