import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';

const upload = multer({ dest: '/uploads' });

// middlewares
import globalErrorHandler from './middleware/globleErrorHandler.middleware';
// routes
import v1Router from './routes';
import CustomError from './utils/customError.utils';

export default (): Application => {
  const app: Application = express();

  // body parser
  app.use(express.json());
  //
  app.use(express.urlencoded({ extended: true }));
  // use cors
  app.use(cors());
  // add security headers
  app.use(helmet());
  // disable fingerprinting
  app.disable('x-powered-by');
  // set public folder for static files
  app.use(express.static(__dirname?.replace('src', '') + 'public'));

  // v1 routes
  app.use('/v1/api', v1Router);
  app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req?.file);
    res.send('file recieved');
  });

  // path not found
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError('Resource not found', 404);
    next(error);
  });

  // global error handler
  app.use(globalErrorHandler);

  return app;
};
