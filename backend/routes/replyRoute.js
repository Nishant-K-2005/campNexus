import express from 'express'
import protect from '../middleware/protect.js'
import { getReplies, sendReply } from '../controllers/replyController.js';

const router = express.Router();

router.post('/sendReply',protect,sendReply);
router.get('/getReplies/:postId',protect,getReplies);

export default router