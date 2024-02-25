import { model, Schema } from 'mongoose';
import mongoose from 'mongoose';
const replySchema = new Schema({
  commenterId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
   
});

const commentSchema = new Schema({
  commenterId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  replies: [replySchema], // Array of reply objects
});

const postSchema = new Schema({
  creatorId: {
    type: String,
    // required: true,
  },
  content: {
    type: String,
    // required: [true, 'Description is required'],
    maxlength: [200, 'Description must be less than 200 characters '],
  },
  media: {
    public_id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  Likes: {
    type: Array,
    default: [],
  },
  LikesCount: {
    type: Number,
    default: 0,
  },
  Comments: [commentSchema],     
}, {
  timestamps: true
});

const Post = model('Post', postSchema);

export default Post;
