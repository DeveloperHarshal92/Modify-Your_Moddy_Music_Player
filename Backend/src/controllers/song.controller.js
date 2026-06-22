import songModel from '../models/song.model.js';
import id3 from 'node-id3';
import { uploadFile } from '../services/storage.service.js';

const DEFAULT_POSTER_URL =
  'https://ik.imagekit.io/developerHarsh/cohort-2/modify/posters/default-poster.jpeg';

async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Song file is required.' });
    }

    const songBuffer = req.file.buffer;
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required.' });
    }

    const tags = id3.read(songBuffer);
    const title = tags?.title?.trim() || req.file.originalname.replace(/\.[^/.]+$/, '');

    const uploadTasks = [
      uploadFile({
        buffer: songBuffer,
        filename: `${title}.mp3`,
        folder: '/cohort-2/modify/songs',
      }),
    ];

    const hasEmbeddedImage = Boolean(tags?.image?.imageBuffer);

    if (hasEmbeddedImage) {
      uploadTasks.push(
        uploadFile({
          buffer: tags.image.imageBuffer,
          filename: `${title}.jpeg`,
          folder: '/cohort-2/modify/posters',
        })
      );
    }

    const [songFile, posterFile] = await Promise.all(uploadTasks);

    const song = await songModel.create({
      title,
      url: songFile.url,
      posterUrl: hasEmbeddedImage ? posterFile.url : DEFAULT_POSTER_URL,
      mood,
    });

    res.status(201).json({
      message: 'Song created successfully.',
      song,
    });
  } catch (err) {
    console.error('uploadSong error:', err);
    res.status(500).json({ message: 'Failed to upload song.' });
  }
}

async function getSong(req, res) {
  try {
    const { mood } = req.query;

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required.' });
    }

    const results = await songModel.aggregate([
      { $match: { mood } },
      { $sample: { size: 1 } },
    ]);

    const song = results[0] || null;

    if (!song) {
      return res.status(404).json({ message: 'No song found for this mood.' });
    }

    res.status(200).json({
      message: 'Song fetched successfully.',
      song,
    });
  } catch (err) {
    console.error('getSong error:', err);
    res.status(500).json({ message: 'Failed to fetch song.' });
  }
}

async function getSongById(req, res) {
  try {
    const { id } = req.params;
    const song = await songModel.findById(id);

    if (!song) {
      return res.status(404).json({ message: 'Song not found.' });
    }

    res.status(200).json({
      message: 'Song fetched successfully.',
      song,
    });
  } catch (err) {
    console.error('getSongById error:', err);
    res.status(500).json({ message: 'Failed to fetch song.' });
  }
}

async function searchSongs(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required.' });
    }

    const regex = new RegExp(q.trim(), 'i');
    const results = await songModel.find({ title: regex }).limit(30);

    res.status(200).json({
      message: 'Search results fetched successfully.',
      results,
    });
  } catch (err) {
    console.error('searchSongs error:', err);
    res.status(500).json({ message: 'Search failed.' });
  }
}

async function getSimilarSongs(req, res) {
  try {
    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);

    const source = await songModel.findById(id);
    if (!source) {
      return res.status(404).json({ message: 'Song not found.' });
    }

    const similar = await songModel
      .find({
        _id: { $ne: source._id },
        mood: source.mood,
      })
      .sort({ playCount: -1 })
      .limit(limit);

    res.status(200).json({
      message: 'Similar songs fetched successfully.',
      similar,
    });
  } catch (err) {
    console.error('getSimilarSongs error:', err);
    res.status(500).json({ message: 'Failed to fetch similar songs.' });
  }
}

export { uploadSong, getSong, getSongById, searchSongs, getSimilarSongs };