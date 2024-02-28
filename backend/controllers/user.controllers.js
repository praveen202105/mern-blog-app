import { config } from 'dotenv';
config();

import User from "../models/user.models.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import crypto from "crypto"
import Razorpay from "razorpay"

import nodemailer from "nodemailer"; // Importing nodemailer for sending emails

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'chadrick.buckridge@ethereal.email',
      pass: 'bbJPaJn3pzg8Zah3b2'
  }
});

import fs from 'fs/promises';
function generateToken() {
  return crypto.randomBytes(20).toString('hex');
}
const cookieOptions = {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
  };

export const registerUser = asyncHandler(async (req, res, next) => {
    // Destructuring the necessary data from req object
    const { fullName, email, password ,confirmpassword,role} = req.body;
  
    // Check if the data is there or not, if not throw error message
    if (!fullName || !email || !password || !confirmpassword) {
      return next(new AppError('All fields are required', 400));
    }
  
    if(password !== confirmpassword) {
        return next(new AppError('Password and Confirm Password should be same', 400));
        
    }
    // Check if the user exists with the provided email
    const userExists = await User.findOne({ email });
  
    // If user exists send the reponse
    if (userExists) {
      return next(new AppError('Email already exists', 409));
    }
  
    // Create new user with the given necessary data and save to DB
    const user = await User.create({
      fullName,
      email,
      password,
      role,
      avatar: {
        public_id: email,
        secure_url:
          'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
      },
    });
  
    // If user not created send message response
    if (!user) {
      return next(
        new AppError('User registration failed, please try again later', 400)
      );
    }
//   console.log(req.file)
    // Run only if user sends a file
    // if (req.file) {
    //     try {
    //       const result = await cloudinary.v2.uploader.upload(req.file.path, {
    //         folder: 'lms', // Save files in a folder named lms
    //         width: 250,
    //         height: 250,
    //         gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
    //         crop: 'fill',
    //       });
    
    //       // If success
    //       if (result) {
    //         // Set the public_id and secure_url in DB
    //         user.avatar.public_id = result.public_id;
    //         user.avatar.secure_url = result.secure_url;
    
    //         // After successful upload remove the file from local storage
    //         fs.rm(`uploads/${req.file.filename}`);
    //       }
    //     } catch (error) {
    //       return next(
    //         new AppError(error || 'File not uploaded, please try again', 400)
    //       );
    //     }
    //   }
    
  
    // // Save the user object
  
    // // Generating a JWT token
    const token = await user.generateJWTToken();
    await user.save();
  
    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;
  
    // Setting the token in the cookie with name token along with cookieOptions
    res.cookie('token', token, cookieOptions);
  
    // If all good send the response to the frontend
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  });


  export const loginUser = async (req, res, next) => {
    // Destructuring the necessary data from req object
    const { email, password } = req.body;
  
    // Check if the data is there or not, if not throw error message
    if (!email || !password) {
      return next(new AppError('Email and Password are required', 400));
    }
  
    // Finding the user with the sent email
    const user = await User.findOne({ email }).select('+password');
  
    // If no user or sent password do not match then send generic response
    if (!(user && (await user.comparePassword(password)))) {
      return next(
        new AppError('Email or Password do not match or user does not exist', 401)
      );
    }
  
    // Generating a JWT token
    const token = await user.generateJWTToken();
    // const token = 1234;
  
    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;
  
    // Setting the token in the cookie with name token along with cookieOptions
    res.cookie('token', token, cookieOptions);
   console.log(req.headers)
    // If all good send the response to the frontend
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token:token,
      user,
    });
  };
  export const logout = async (_req, res, _next) => {
  
 
    // Setting the cookie value to null
    res.cookie('token', null, {
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 0,
      httpOnly: true,
    });
  
    // Sending the response
    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  };

  export const ForgetPassword = asyncHandler(async(req,res,next) => {
    const { email } = req.body;
  console.log("called")
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const token = generateToken();
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      const resetLink = `http://localhost:5173/setNewPassword?token=${token}`;
  
      const mailOptions = {
        from: 'pg444222@gmail.com',
        to: email,
        subject: 'Reset Your Password',
        html: `Click <a href="${resetLink}">here</a> to reset your password.`
      };
  
     let info= await transporter.sendMail(mailOptions);
  
      res.json({ 
        message: 'Password reset link sent successfully',
      messageId:  info.messageId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

 
  
  export const VerifyToken = asyncHandler(async(req,res,next) => {
    const {password,token}  = req.body;
    // const token =req.params.token;
    console.log(req.body);
    try {
      const users = await User.find({ resetPasswordExpires: { $gt: Date.now() } });
      const user = users.find(u => u.resetPasswordToken === token);

console.log('Token:', token);
console.log('Current Time:', Date.now());
console.log('User:', user); // Check if user is found
if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
})
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});



export const payment = asyncHandler(async(req,res,next) => {
  
    const { amount} = req.body;

  const options = {
    amount: amount * 100 ,// Razorpay expects amount in paisa (Indian currency)
    currency: 'INR',
    // receipt,
    // notes
  };
 console.log("called")
  razorpay.orders.create(options, (err, order) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong!' });
    }
  // Extract payment ID and order ID from the response
  const razorpay_payment_id = order.id;


     const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
                                    .update(razorpay_payment_id)
                                   .digest('hex');

  res.status(200).json({
    razorpay_payment_id,
    razorpay_signature:generated_signature

  });   
   
  });
  
});




export const verifypayment = asyncHandler(async(req,res,next) => {
  
    const { razorpay_payment_id,razorpay_signature } = req.body;

  // Verify the signature to ensure payment authenticity
  const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
  .update(razorpay_payment_id)
 .digest('hex');

  if (generated_signature === razorpay_signature) {
    // Payment verified successfully
    // Update user status or perform other actions as needed
    res.status(200).json({ message: 'Payment successful!' });
  } else {
    res.status(400).json({ error: 'Payment verification failed!' });
  }
}
);
  
