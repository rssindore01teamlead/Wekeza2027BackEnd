
import { Router } from 'express';
import UsersController from '../controllers/users.controller';
import ResourceController from '../controllers/resource.controller';
import { contactUsDto, CreateUserDto, loginUserDto, UpdateUserDto, storeTrendingDto } from '../dtos/users.dto';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import auth from '../middlewares/auth.middleware';
import { uploadS3 } from '../utils/util';
import { storeAlpacaDto } from '../dtos/admin.dto';


const multer = require('multer');
var multerS3 = require('multer-s3');

class AuthRoute implements Route {

  public path = '/auth';

  public router = Router();
  public usersController = new UsersController();
  public resourceController = new ResourceController();

  constructor() {

    this.initializeRoutes();
  }

  private initializeRoutes() {

    //------------Api Called for Postgres Database-----------------------------------

    this.router.post(`${this.path}/logIn`, this.usersController.logIn);
    this.router.post(`${this.path}/createUser`, validationMiddleware(CreateUserDto, 'body', false, []), this.usersController.createUser);
    this.router.post(`${this.path}/forgotMail`, this.usersController.forgotMail);
    this.router.post(`${this.path}/tokenVerification`, this.usersController.TokenVerification);

    this.router.put(`${this.path}/updateUser`, auth, validationMiddleware(UpdateUserDto, 'body', false, ['update']), this.usersController.updateUser);
    this.router.put(`${this.path}/updatealpaca`, auth, validationMiddleware(UpdateUserDto, 'body', false, ['update']), this.usersController.updateAlpaca);
    this.router.post(`${this.path}/sendmail`, auth, this.usersController.sendmail);
    this.router.post(`${this.path}/changePassword`, auth, this.usersController.changePassword);
    this.router.post(`${this.path}/addTrendingstock`, auth, validationMiddleware(storeTrendingDto, 'body', false, []), this.usersController.trendingData);
    this.router.get(`${this.path}/getTrendingdata`, auth, this.usersController.toptraendingdata);
    this.router.put(`${this.path}/updateUser`, auth, validationMiddleware(CreateUserDto, 'body', false, ['update']), this.usersController.updateUser);
    this.router.post(`${this.path}/uploadImages`, auth, uploadS3.array('image', 10), this.resourceController.images);
    this.router.post(`${this.path}/contactUsMail`, auth, validationMiddleware(contactUsDto, 'body', false, []), this.usersController.contactUsMail);
    this.router.post(`${this.path}/storeData`, auth, validationMiddleware(storeAlpacaDto, 'body', false, []), this.usersController.storeAlpacadata);
    this.router.get(`${this.path}/getKey`, auth, this.usersController.getKey);
    //--------------------------------------------------------


    //-------------------------Plaid---------------------------

    this.router.post(`${this.path}/getPlaidlinktoken`, this.usersController.getPlaidlinktoken);
    this.router.post(`${this.path}/set_access_token`, this.usersController.set_access_token);
    this.router.post(`${this.path}/getPlaidaccount`, this.usersController.getPlaidaccount);
  }
}

export default AuthRoute;
