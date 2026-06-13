import express from 'express';
import { signup, login, session, logout, deleteUser } from '../controllers/authController.js';
import protect from '../middleware/protect.js';
import validate from '../middleware/validate.js';
import { loginSchema, signupSchema } from '../validations/auth.validate.js';

const router = express.Router();

router.post('/signup',validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/session', protect, session);
router.post('/logout',protect, logout)
router.delete('/delete/:user_id', protect, deleteUser);

export default router;