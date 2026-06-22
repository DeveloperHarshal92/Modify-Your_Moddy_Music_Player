import commentModel from '../models/comment.model.js';
import songModel from '../models/song.model.js';

async function addComment(req, res) {
  try {
    const { songId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const song = await songModel.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found.' });
    }

    const comment = await commentModel.create({
      song: songId,
      user: userId,
      username,
      text: text.trim(),
    });

    res.status(201).json({
      message: 'Comment posted successfully.',
      comment,
    });
  } catch (err) {
    console.error('addComment error:', err);
    res.status(500).json({ message: 'Failed to post comment.' });
  }
}

async function getComments(req, res) {
  try {
    const { songId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const comments = await commentModel
      .find({ song: songId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      message: 'Comments fetched successfully.',
      comments,
    });
  } catch (err) {
    console.error('getComments error:', err);
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
}

export { addComment, getComments };