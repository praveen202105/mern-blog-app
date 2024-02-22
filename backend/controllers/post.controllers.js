import Post from "../models/post.models.js";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary"
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';


export const createPost = async(req, res,next) =>{
  
//  console.log(req.file);
//  console.log(req.body.content);
 

  const post = await Post.create({
    content:req.body.content,
    media: {}
});
if (!req.body.content && !req.file) {
    return next(new AppError('content or media are required', 400));
  }

    
      if (req.file) {
        try {
          const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'post', // Save files in a folder named lms
           width: 250,
            height: 250,
           // gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
            crop: 'fill',
          });
    
          // If success
          if (result) {
            // Set the public_id and secure_url in DB
            post.media.public_id = result.public_id;
            post.media.secure_url = result.secure_url;
    
            // After successful upload remove the file from local storage
            fs.rm(`uploads/${req.file.filename}`);
          }
        } catch (error) {
          return next(
            new AppError(error || 'File not uploaded, please try again', 400)
          );
        }
      }
    // Decoding the token using jwt package verify method
   
const { token } = req.cookies;
const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // If no decode send the message unauthorized
    if (!decoded) {
      return next(new AppError("Unauthorized, please login to continue", 401));
    }
  
    console.log(decoded);
    post.creatorId = decoded.id;
  
    // Save the user object
    await post.save();
    res.status(201).json({
        success: true,
        message: 'Post created successfully',
        post,
      });

}

export const deletePostById = async (req, res, next) => {
    // Extracting id from the request parameters
    const { id } = req.params;
  
    // Finding the course via the course ID
    const post = await Post.findById(id);
  
    // If course not find send the message as stated below
    if (!post) {
      return next(new AppError('post with given id does not exist.', 404));
    }
  
    // Remove course
    await post.deleteOne();
  
    // Send the message as response
    res.status(200).json({
      success: true,
      message: 'post deleted successfully',
    });
  };


  export const updatepostById = async (req, res, next) => {
    // Extracting the course id from the request params
    const { id } = req.params;
//     const { content } = req.body;
//   console.log(req.body.chunk_size);
//   const c ={};
//     if(Object.keys(req.body).length === 0) {
//       return next(new AppError('fields are required', 400));
//     }
  
    // Finding the course using the course id
    const post = await Post.findByIdAndUpdate(
      
      id,
      {
        $set: req.body, 
       
        // This will only update the fields which are present
      },{
        $set:req.file,
      },
      {
        runValidators: true, // This will run the validation checks on the new data
      }
    );
    console.log(req.body);
    // If no course found then send the response for the same
    if (!post) {
      return next(new AppError('Invalid post id or post not found.', 400));
    }
    if (req.file) {
        try {
          const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'post', // Save files in a folder named lms
           width: 250,
            height: 250,
           // gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
            crop: 'fill',
          });
    
          // If success
          if (result) {
            // Set the public_id and secure_url in DB
            post.media.public_id = result.public_id;
            post.media.secure_url = result.secure_url;
    
            // After successful upload remove the file from local storage
            fs.rm(`uploads/${req.file.filename}`);
          }
        } catch (error) {
          return next(
            new AppError(error || 'File not uploaded, please try again', 400)
          );
        }
      }
    
      
      // If all good store the id in req object, here we are modifying the request object and adding a custom field user in i
    // Save the user object
    await post.save();
    // Sending the response after success
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
    });
  };
  

  export const allpost = async (req, res,next) => {
    const posts=await Post.find({});

    res.status(200).json({
        success: true,
        message: 'All posts',
        posts,
      });

  };

  export const likepost = async (req, res,next) =>{
      const { token } = req.cookies;
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log()
      const id=req.params.postid;
      const postdetails = await Post.findById(id);
      console.log(postdetails); 
      if (!postdetails) {
        return next(new AppError('post with given id does not exist.', 404));
      }
      
      if (!decoded) {
        return next(new AppError("Unauthorized, please login to continue", 401));
      }
      
      const userid=decoded.id;

      if(postdetails.Likes.includes(userid)) {
        return next(new AppError("you already likes this post", 401));
      }
    
     
      postdetails.Likes.push(userid);
      postdetails.LikesCount++;
   
      await postdetails.save();
      res.status(200).json({
          success: true,
          postdetails,
        });
      }

      export const createcomment = async(req,res,next)=>{
        const { token } = req.cookies;
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log()
      const id=req.params.postid;
      const postdetails = await Post.findById(id);
      // console.log(postdetails); 
      if (!postdetails) {
        return next(new AppError('post with given id does not exist.', 404));
      }
      
      if (!decoded) {
        return next(new AppError("Unauthorized, please login to continue", 401));
      }
      
      const userid=decoded.id;
     console.log(postdetails);
     
     postdetails.Comments.push({
      commentorId:userid,
      description:req.body.description
     });
   
      await postdetails.save();
      res.status(200).json({
          success: true,
          postdetails,
        });
      }