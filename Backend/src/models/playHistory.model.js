import mongoose from 'mongoose';

const playHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true,
    },
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'songs',
      required: true,
      index: true,
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

playHistorySchema.index({ user: 1, playedAt: -1 });

const playHistoryModel = mongoose.model('playHistory', playHistorySchema);

export default playHistoryModel;