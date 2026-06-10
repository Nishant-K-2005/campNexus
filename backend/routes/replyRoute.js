import express from 'express'
import protect from '../middleware/protect.js'
import { getReplies, sendReply } from '../controllers/replyController.js';

const router = express.Router();

router.post('/replies',protect,sendReply);
router.get('/replies/:postId',protect,getReplies);

export default router