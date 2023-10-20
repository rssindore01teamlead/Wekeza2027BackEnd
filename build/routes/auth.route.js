"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const resource_controller_1 = __importDefault(require("../controllers/resource.controller"));
const users_dto_1 = require("../dtos/users.dto");
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const util_1 = require("../utils/util");
const admin_dto_1 = require("../dtos/admin.dto");
const multer = require('multer');
var multerS3 = require('multer-s3');
class AuthRoute {
    constructor() {
        this.path = '/auth';
        this.router = express_1.Router();
        this.usersController = new users_controller_1.default();
        this.resourceController = new resource_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //------------postgres details-----------------------------------
        this.router.post(`${this.path}/logIn`, this.usersController.logIn);
        this.router.post(`${this.path}/createUser`, validation_middleware_1.default(users_dto_1.CreateUserDto, 'body', false, []), this.usersController.createUser);
        this.router.put(`${this.path}/updateUser`, auth_middleware_1.default, validation_middleware_1.default(users_dto_1.UpdateUserDto, 'body', false, ['update']), this.usersController.updateUser);
        this.router.post(`${this.path}/ResetPassword`, auth_middleware_1.default, this.usersController.ResetPassword);
        this.router.post(`${this.path}/forgotMail`, this.usersController.forgotMail);
        this.router.put(`${this.path}/updatealpaca`, auth_middleware_1.default, validation_middleware_1.default(users_dto_1.UpdateUserDto, 'body', false, ['update']), this.usersController.updateAlpaca);
        this.router.post(`${this.path}/sendmail`, this.usersController.sendmail);
        this.router.post(`${this.path}/uploadImages`, util_1.uploadS3.array('image', 1), this.usersController.images);
        this.router.post(`${this.path}/changePassword`, auth_middleware_1.default, this.usersController.changePassword);
        this.router.post(`${this.path}/addTrendingstock`, validation_middleware_1.default(users_dto_1.storeTrendingDto, 'body', false, []), this.usersController.trendingData);
        this.router.get(`${this.path}/getTrendingdata`, this.usersController.toptraendingdata);
        //--------------------------------------------------------
        this.router.post(`${this.path}/storeData`, validation_middleware_1.default(admin_dto_1.storeAlpacaDto, 'body', false, []), this.usersController.storeAlpacadata);
        //-------------------------Plaid---------------------------
        this.router.post(`${this.path}/createAccount`, this.usersController.createAccount);
        this.router.post(`${this.path}/getPlaidlinktoken`, this.usersController.getPlaidlinktoken);
        this.router.post(`${this.path}/set_access_token`, this.usersController.set_access_token);
        this.router.post(`${this.path}/getPlaidaccount`, this.usersController.getPlaidaccount);
        this.router.put(`${this.path}/updateUser`, auth_middleware_1.default, validation_middleware_1.default(users_dto_1.CreateUserDto, 'body', false, ['update']), this.usersController.updateUser);
        this.router.post(`${this.path}/uploadImages`, util_1.uploadS3.array('image', 10), this.resourceController.images);
        this.router.get(`${this.path}/getImage/:Key`, this.resourceController.getImage);
        this.router.post(`${this.path}/contactUsMail`, validation_middleware_1.default(users_dto_1.contactUsDto, 'body', false, []), this.usersController.contactUsMail);
        this.router.post(`${this.path}/tokenVerification`, this.usersController.TokenVerification);
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=auth.route.js.map