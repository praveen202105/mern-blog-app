import { config } from 'dotenv';
config();

import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

import errorMiddleware from "./middlewares/error.middleware.js";
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';

const app = express();

const corsOptions ={
  origin:'http://localhost:5000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Server Status Check Route
app.get('/ping', (_req, res) => {
  res.send('Pong');
});

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);

// 404 Route
app.all('*', (_req, res) => {
  res.status(404).send('OOPS!!! 404 Page Not Found');
});

// Error Middleware (Must be defined at the end)
app.use(errorMiddleware);

export default app;
