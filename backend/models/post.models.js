import { model, Schema } from 'mongoose';

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
    Comments:{
     type:Array,
    },     

  
},{
  timestamps: true
});

const Post = model('Post', postSchema);

export default Post;
