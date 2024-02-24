import { model, Schema } from 'mongoose';
const replySchema = new Schema({
  commenterId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const commentSchema = new Schema({
  commenterId: {
    type: String,
    
  },
  description: {
    type: String,
   
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  replies: [replySchema]
}, 
// { _id: false }
);
const postSchema = new Schema(
    {
        creatorId: {
          type: String,
        //   required: true,
     },
        
    
    content: {
      type: String,
    //   required: [true, 'Description is required'],
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
      type:Array,
      default:[],
    },
    LikesCount:{
      type:Number,
      default:0,
    },
    Comments:[commentSchema],     

  
},{
  timestamps: true
});

const Post = model('Post', postSchema);

export default Post;
