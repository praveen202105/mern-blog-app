import User from "../models/user.models.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import fs from 'fs/promises';

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
  
    // If all good send the response to the frontend
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
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