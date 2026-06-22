import express from 'express';
import multer from 'multer';
import upload from '../middleware/upload.middleware.js';
import * as songController from '../controllers/song.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 *  @route /api/songs/
 */
router.post(
  '/',
  upload.single('song'),
  songController.uploadSong,
  // multer error handler — catches fileFilter rejections + size-limit errors
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Max size is 12MB.' });
      }
      return res.status(400).json({ message: err.message || 'Invalid file upload.' });
    }
    next(err);
  }
);

/**
 *  @route /api/songs/
 */
router.get('/', songController.getSong);

/**
 *  @route /api/songs/search
 */
router.get('/search', songController.searchSongs);

/**
 *  @route /api/songs/:id/similar
 */
router.get('/:id/similar', authUser, songController.getSimilarSongs);

/**
 *  @route /api/songs/:id
 */
router.get('/:id', songController.getSongById);

export default router;