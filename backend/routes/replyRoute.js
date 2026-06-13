import express from 'express'
import protect from '../middleware/protect.js'
import { deleteReply, getReplies, sendReply } from '../controllers/replyController.js';

const router = express.Router();

router.post('/replies',protect,sendReply);
router.get('/replies/:post_id',protect,getReplies);
router.delete('/replies/:reply_id',protect,deleteReply);

export default router