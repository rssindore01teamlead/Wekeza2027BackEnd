
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import Routes from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';


class App {

  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {

    this.app = express();
    this.port = process.env.PORT || 8000;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`🚀 App listening on the port ${this.port}. Current Env ${this.env}.`);
    });
  }

  public getServer() {

    return this.app;
  }

  private initializeMiddlewares() {

    if (this.env === 'production') {

      this.app.use(morgan('combined', { stream }));
      this.app.use(cors());
    } else if (this.env === 'development') {

      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(hpp());//to avoid the duplicate values in req
    this.app.use(helmet()); // provide security-related HTTP headers
    this.app.use(compression());//the response content will be compressed before being sent to the client 
    this.app.use(express.json({ limit: '50mb' })); //JSON payload in incoming requests will be limited 
    this.app.use(express.urlencoded({ extended: true }));// is used to handle form submissions and other data sent using the application/x-www-form-urlencoded content type
    this.app.use(cookieParser());//to parse cookies from incoming HTTP requests
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api/v1/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
