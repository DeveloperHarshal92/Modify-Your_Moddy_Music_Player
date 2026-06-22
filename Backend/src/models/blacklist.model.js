import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, 'Token is required for blacklisting'],
      unique: [true, 'Token must be unique'],
    },
  },
  {
    timestamps: true,
  },
);

const blacklistModel = mongoose.model('blacklist', blacklistSchema);

export default blacklistModel;
