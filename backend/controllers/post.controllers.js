import Post from "../models/post.models.js";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary"
import fs from 'fs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler.middleware.js"
import imagekit from "../configs/imagekit.js";
import axios from "axios";

axios.defaults.timeout = 500;

export const createPost = asyncHandler(async(req, res,next) =>{

  //  console.log(req.file);
  //  console.log(req.body.content);
  
  
    const post = await Post.create({
      content:req.body.content,
      media: {
        // "public_id":"123",
        // "secure_url":"1234"
      }
  });
  if (!req.body.content && !req.file) {
      return next(new AppError('content or media are required', 400));
    }
  
  
        if (req.file) {
          try {
            const fileStream = fs.createReadStream(req.file.path);
            const result = await imagekit.upload({
              file: fileStream,
              fileName: req.file.filename,
              folder: '/post', // Save files in a folder named post
              tags: ['post'],
              isPrivateFile: false, // Change to true if you want the file to be private
            });
          console.log(result);
            // If success
            if (result ) {
              // Set the public_id and secure_url in DB
              post.media.public_id = result.fileId;
              post.media.secure_url = result.thumbnailUrl;
          
              // After successful upload remove the file from local storage
              fs.rmSync(req.file.path);
            }
          } catch (error) {
            console.log(error)
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
  
  });
  
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
    const { id } = req.params;

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
        const fileStream = fs.createReadStream(req.file.path);
        const result = await imagekit.upload({
          file: fileStream,
          fileName: req.file.filename,
          folder: '/post', // Save files in a folder named post
          tags: ['post'],
          isPrivateFile: false, // Change to true if you want the file to be private
        });
      console.log(result);
        // If success
        if (result ) {
          // Set the public_id and secure_url in DB
          post.media.public_id = result.fileId;
          post.media.secure_url = result.thumbnailUrl;
      
          // After successful upload remove the file from local storage
          fs.rmSync(req.file.path);
        }
      } catch (error) {
        console.log(error)
        return next(
        
          new AppError(error || 'File not uploaded, please try again', 400)
        );
      }
    }
    
      
      // If all good store the id in req object, here we are modifying the request object and adding a custom field user in i
    // Save the user object
    const updatedpost=await post.save();
    // Sending the response after success
    res.status(200).json({
      success: true,
      message: "post updated successfully",
      post:updatedpost
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
    // console.log("called");
      const { token } = req.cookies;
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(req.params.postid)
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

      // if(postdetails.Likes.includes(userid)) {
      //   return next(new AppError("you already likes this post", 401));
      // }
    
     
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
      const id=req.params.postid;
      const postdetails = await Post.findById(id);
      
      if (!postdetails) {
        return next(new AppError('post with given id does not exist.', 404));
      }
      
      if (!decoded) {
        return next(new AppError("Unauthorized, please login to continue", 401));
      }
      
      const userid=decoded.id;
     console.log(userid);
     const comment = {
      commenterId: userid, // Include the commenterId field
      description: req.body.description
    };
     postdetails.Comments.push(comment);
   
      await postdetails.save();
      res.status(200).json({
          success: true,
          postdetails,
        });
      }

      export const editComment = async (req, res, next) => {
        try {
          const { postId, commentId } = req.params;
          const { description } = req.body;
      
          // Validate the postId and commentId
          if (!postId || !commentId) {
            return res.status(400).json({ error: 'Missing postId or commentId' });
          }
      
          // Validate and decode the JWT token
          const token = req.cookies.token;
          if (!token) {
            throw new AppError('Unauthorized, please login to continue', 401);
          }
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (!decoded) {
            throw new AppError('Unauthorized, please login to continue', 401);
          }
      
          // Find the post and its associated comment
          const post = await Post.findById(postId);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
      
          const comment = post.Comments.find(comment => comment._id.toString() === commentId);
          if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
          }
      
          // Check if the user is authorized to edit the comment
          if (comment.commenterId !== decoded.id) {
            return res.status(403).json({ error: 'You are not authorized to edit this comment' });
          }
      
          // Update the comment description
          comment.description = description;
      
          // Save the post with the updated comment
          await post.save();
      
          // Return success response
          return res.status(200).json({ message: 'Comment edited successfully', post });
        } catch (error) {
          next(error); // Pass the error to the next middleware
        }
      };
      


      export const deletecomment = async (req, res, next) => {
        try {
          console.log("Delete comment called");
      
          // Authorization using JWT
          const { token } = req.cookies;
          const decoded = await jwt.verify(token, process.env.JWT_SECRET);
          if (!decoded) {
            return next(new AppError("Unauthorized, please login to continue", 401));
          }
      
          // Extract post and comment IDs from request parameters
          const postId = req.params.postId;
          const commentId = req.params.commentId;
      
          // Find the post by ID
          const post = await Post.findById(postId);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
      
          // Find the comment within the post's comments array
          const commentIndex = post.Comments.findIndex(
            (comment) => comment._id.toString() === commentId
          );
      
          if (commentIndex === -1) {
            return res.status(404).json({ error: 'Comment not found' });
          }
      
          // // Remove the comment from the post's comments array
          // post.Comments.splice(commentIndex, 1);
      
          post.Comments = post.Comments.filter(
            (comment) => comment._id.toString() !== commentId && comment.parentId !== commentId
          );
          // Save the updated post document
          await post.save();
      
          // Send successful response
          res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            post: post,
          });
        } catch (error) {
          next(error);
        }
      };
    export const createReply = async (req, res) => {
      try {
        console.log("reply create called")
        const { postId, commentId } = req.params;
        const { description } = req.body;
    
        // Validate the postId and commentId
        if (!postId || !commentId) {
          return res.status(400).json({ error: 'Missing postId or commentId' });
        }
    
        // Validate and decode the JWT token
        const token = req.cookies.token;
        if (!token) {
          throw new AppError('Unauthorized, please login to continue', 401);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
          throw new AppError('Unauthorized, please login to continue', 401);
        }
    
        // Find the post and its associated comment
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
        console.log(post)
        const comment = post.Comments.find(comment => comment._id.toString() === commentId);
        console.log(comment);
        if (!comment) {
          return res.status(404).json({ error: 'Comment not found' });
        }
    
        // Create the reply object
        const reply = {
          commenterId: decoded.id,
          description: description,
          parentId: commentId
        };
    
        // Add the reply to the comment's replies array
        // comment.push(reply);
        post.Comments.push(reply);
        // Save the post with the updated comment
        await post.save();
    
        // Return success response
        return res.status(201).json({ message: 'Reply added successfully', comment });
      }  catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
    };