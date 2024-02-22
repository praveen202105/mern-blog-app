config();
import cookieParser from 'cookie-parser';
import express from 'express';
import errorMiddleware from "./middlewares/error.middleware.js"
import morgan from 'morgan';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
// Server Status Check Route
app.get('/ping', (_req, res) => {
    res.send('Pong');
  });

  // Default catch all route - 404



  import userRoutes from './routes/user.routes.js';
  import postRoutes from './routes/post.routes.js';

  app.use('/api/v1/user', userRoutes);
  
app.use('/api/v1/post', postRoutes);


  app.all('*', (_req, res) => {
    res.status(404).send('OOPS!!! 404 Page Not Found');
  });

  app.use(errorMiddleware);
  export default app;