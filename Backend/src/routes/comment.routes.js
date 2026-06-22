import express from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 *  @route /api/comments/:songId
 */
router.post('/:songId', authUser, commentController.addComment);

/**
 *  @route /api/comments/:songId
 */
router.get('/:songId', commentController.getComments);

export default router;