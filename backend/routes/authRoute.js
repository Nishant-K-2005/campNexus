import express from 'express';
import { signup, login, session } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js'

const router = express.Router();

// Define the endpoints
router.post('/signup', signup);
router.post('/login', login);
router.get('/session', protect, session)
export default router;