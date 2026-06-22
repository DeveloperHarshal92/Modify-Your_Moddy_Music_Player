import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    enum: {
      values: ['sad', 'happy', 'surprised'],
      message: 'Enum this is...',
    },
  },
  playCount: {
    type: Number,
    default: 0,
  },
});

const songModel = mongoose.model('songs', songSchema);

export default songModel;