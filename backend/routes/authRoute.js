import express from 'express';
import { signup, login, session, logout } from '../controllers/authController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/session', protect, session);
router.post('/logout',protect, logout)

export default router;