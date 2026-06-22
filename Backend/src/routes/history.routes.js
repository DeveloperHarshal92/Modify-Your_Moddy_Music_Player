import express from 'express';
import * as historyController from '../controllers/history.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 *  @route /api/history/play
 */
router.post('/play', authUser, historyController.recordPlay);

/**
 *  @route /api/history/recent
 */
router.get('/recent', authUser, historyController.getRecentlyPlayed);

export default router;