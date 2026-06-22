import mongoose from 'mongoose';
import playHistoryModel from '../models/playHistory.model.js';
import songModel from '../models/song.model.js';

async function recordPlay(req, res) {
  const { songId } = req.body;
  const userId = req.user.id;

  if (!songId) {
    return res.status(400).json({ message: 'songId is required.' });
  }

  const song = await songModel.findById(songId);
  if (!song) {
    return res.status(404).json({ message: 'Song not found.' });
  }

  const entry = await playHistoryModel.create({
    user: userId,
    song: songId,
  });

  await songModel.findByIdAndUpdate(songId, { $inc: { playCount: 1 } });

  res.status(201).json({
    message: 'Play recorded successfully.',
    entry,
  });
}

async function getRecentlyPlayed(req, res) {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);

  const recent = await playHistoryModel.aggregate([
    { $match: { user: userId } },
    { $sort: { playedAt: -1 } },
    {
      $group: {
        _id: '$song',
        lastPlayedAt: { $first: '$playedAt' },
      },
    },
    { $sort: { lastPlayedAt: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'songs',
        localField: '_id',
        foreignField: '_id',
        as: 'song',
      },
    },
    { $unwind: '$song' },
    {
      $project: {
        _id: 0,
        song: 1,
        lastPlayedAt: 1,
      },
    },
  ]);

  res.status(200).json({
    message: 'Recently played fetched successfully.',
    recent,
  });
}

export { recordPlay, getRecentlyPlayed };