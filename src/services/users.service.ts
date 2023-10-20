
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { contactUsDto, CreateUserDto, loginUserDto, resetPasswordDto, UpdateUserDto, ChangePasswordDto, storeTrendingDto } from '../dtos/users.dto';
import { storeAlpacaDto } from '../dtos/admin.dto';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/users.interface';
import { Stocks } from '../interfaces/tending.interface';
import { isEmpty, cleanObj, uploadToAws } from '../utils/util';
import DB, { T } from '../database/index.schema';
import { decrypt, encrypt } from '../utils/crypto';
import { v4 as uuid } from 'uuid';
import MailService from '../services/mail.service';
import { token } from 'morgan';
import { link } from 'fs';

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const util = require('util');


const APP_PORT = process.env.APP_PORT || 8000;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(
  ',',
);
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
  ',',
);
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || '';

let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
// The payment_id is only relevant for the UK Payment Initiation product.
// We store the payment_id in memory - in production, store it in a secure
// persistent data store
let PAYMENT_ID = null;
// The transfer_id is only relevant for Transfer ACH product.
// We store the transfer_id in memory - in production, store it in a secure
// persistent data store
let TRANSFER_ID = null;

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)

const configuration = new Configuration({

  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const client = new PlaidApi(configuration);

const prettyPrintResponse = (response) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

class UserService {

  public mailService = new MailService();


  public async createUser(userData: CreateUserDto): Promise<User> {

    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    const findUser: User = await DB(T.ER_SIGNUP).where('email', userData.email).first();
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const inserted = await DB(T.ER_SIGNUP).insert(userData).returning('*');

    if (inserted) {

      const textmail = "<span  style='display: block; width: 500px;margin: 0 auto; box-shadow: 0px 0px 10px #ccc; border-radius: 20px; padding: 30px 30px; border-top: 5px solid #4678f8; border-bottom: 5px solid #4678f8;background-repeat: no-repeat; background-position-x: right;background-position-y: top;background-size: 250px; box-shadow: 0px 0px 15px #ccc;'><p style='margin-top: 120px; font-size='16px''>Dear " + userData.fname + " " + userData.lname + ",</p> <p style='font-size='16px''>Thank you for registering with Wekeza trading app."
      this.mailService.sendEmail(userData.email, textmail, 'Wekeza Signup');
    }
    return inserted[0];
  };

  public async trendingData(userData: storeTrendingDto): Promise<Stocks> {

    if (isEmpty(userData)) throw new HttpException(400, "Data is empty");
    const inserted = await DB(T.ER_TRENDING_STOCKS).insert(userData).returning('*');
    return inserted[0];
  };

  public async toptraendingdata(): Promise<Stocks[]> {

    try {
      const found = await DB.select('symbol', 'stock_name')
        .from('trending_stocks')
        .whereBetween('created_at', [DB.raw('now() - INTERVAL \'90 days\''), DB.raw('now()')])
        .distinct()
        .limit(5);
      return found;
    } catch (error) {
      throw new HttpException(409, `Data Not Found`);
    }
  };

  public async changePassword(userData: ChangePasswordDto): Promise<any> {

    const allowedKeys = ['user_id', 'password', 'newpassword'];
    const cleaned: any = cleanObj(userData, allowedKeys);
    let updated;
    const findUser = await DB(T.ER_SIGNUP).where('user_id', cleaned.user_id).first();
    if (!findUser) {
      throw new HttpException(409, `You're user_id ${cleaned.user_id} not found`);
    }
    else {
      const isPasswordMatching: boolean = await bcrypt.compare(cleaned.password, findUser.password);
      if (!isPasswordMatching) throw new HttpException(409, "Old password is incorrect");
      cleaned.newpassword = await bcrypt.hash(cleaned.newpassword, 10);
      updated = await DB(T.ER_SIGNUP).where('user_id', (cleaned.user_id)).update('password', cleaned.newpassword).returning('*');
    }
    return updated[0];

  };

  public async storeAlpaca(userData: storeAlpacaDto): Promise<User> {

    if (isEmpty(userData)) throw new HttpException(400, "Data is empty");
    const found = await this.getOne(Number(userData.user_id));
    if (!found) throw new HttpException(409, `User ${userData.user_id} doesn't exists`);
    const inserted = await DB(T.ER_ALPACA_ACC).insert(userData).returning('*');
    return inserted[0];
  };

  public async createAccount(userData: any): Promise<User> {
    
    return null;
  };

  public async getPlaidlinktoken(): Promise<User> {

    try {

      const configs = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: 'user_id',
        },
        client_name: 'Plaid Quickstart',
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: 'en',
      };
      if (PLAID_REDIRECT_URI !== '') {
        configs['redirect_uri'] = PLAID_REDIRECT_URI;
      }
      if (PLAID_ANDROID_PACKAGE_NAME !== '') {
        configs['android_package_name'] = PLAID_ANDROID_PACKAGE_NAME;
      }
      const createTokenResponse = await client.linkTokenCreate(configs);
      prettyPrintResponse(createTokenResponse);
      return (createTokenResponse.data);
      //return tokenResponse;
    } catch (e) {
      return null;
    }
  };

  public async set_access_token(token: any): Promise<any> {

    try {

      const tokenResponse = await client.itemPublicTokenExchange({
        public_token: token
      });
      //prettyPrintResponse(tokenResponse);
      ACCESS_TOKEN = tokenResponse.data.access_token;
      ITEM_ID = tokenResponse.data.item_id;

      let linktoken = {
        access_token: ACCESS_TOKEN,
        item_id: ITEM_ID,
        error: null,
      }
      return linktoken //JSON.parse(tokenResponse);
    } catch (e) {
      return null;
    }
  };

  public async getPlaidaccount(token: any): Promise<any> {

    try {
      // client.getAccounts(token, function (error, accountsResponse) {
      //   if (error != null) {
      //     prettyPrintResponse(error);
      //     return null;
      //   }
      //   prettyPrintResponse('account : -' + accountsResponse);
      //   return accountsResponse;        
      //});
      const authResponse = await client.authGet({
        access_token: ACCESS_TOKEN,
      });
      prettyPrintResponse(authResponse);
      return (authResponse.data);

    } catch (e) {
      return null;
    }
  };

  public async login(userData: loginUserDto): Promise<{ findUser: User, acc: any }> {

    let finduser = {};

    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    let email = userData.email.toLowerCase();
    const findUser = await DB(T.ER_SIGNUP).whereRaw(`LOWER(email) LIKE ?`, [`${email}`]).first();
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);
    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");
    const acc = await DB(T.ER_ALPACA_ACC).where(`user_id`, findUser.user_id);
    const token = jwt.sign(
      { user_id: findUser.user_id },
      process.env.JWT_SECRET,
    );
    findUser.token_id = token;
    finduser = findUser;

    return { findUser, acc };
  };

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};Secure;SameSite=None`;
  };

  public async update(data: UpdateUserDto): Promise<any> {

    const allowedKeys = ['user_id', 'fname', 'lname', 'investing_type', 'job_title', 'annual_income', 'liquid_asset', 'funding_account', 'phone_no', 'street_address', 'city', 'state', 'postal_code', 'country', 'basic_info', 'profilepic', 'current_employer'];
    const cleaned: any = cleanObj(data, allowedKeys);
    const found = await this.getOne(Number(cleaned.user_id));
    if (!found) throw new HttpException(409, `User ${cleaned.id} doesn't exists`);
    const updated = await DB(T.ER_SIGNUP).where('user_id', Number(data.user_id)).update(cleaned).returning('*');
    return updated[0];
  };

  public async updateAlpaca(data: UpdateUserDto): Promise<any> {

    const allowedKeys = ['user_id', 'al_status'];
    const cleaned: any = cleanObj(data, allowedKeys);
    const found = await this.getOne(Number(cleaned.user_id));
    if (!found) throw new HttpException(409, `User ${cleaned.id} doesn't exists`);
    const updated = await DB(T.ER_ALPACA_ACC).where('user_id', Number(data.user_id)).update(cleaned).returning('*');
    return updated[0];
  };

  public async getOne(id: number): Promise<any> {

    const found = await DB(T.ER_SIGNUP).where('user_id', id).first();
    if (!found) throw new HttpException(409, 'Unable to find user with id: ' + id + '.');
    return found;
  };

  public async forgotPassword(email: string): Promise<any> {

    let email1 = email.toLowerCase();

    const found = await DB(T.ER_SIGNUP).whereRaw(`LOWER(email) LIKE ?`, [`${email1}`]).first();
    if (!found) throw new HttpException(409, 'Unable to find user with email: ' + email + '.');
    let token_id = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    const update = await DB(T.ER_SIGNUP).update({ 'token_id': token_id }).where('user_id', found.user_id);
    if (!update) throw new HttpException(409, 'Something Went Wrong..');
    var link = token_id;
    let head = "<div style='width: 690px;margin: 20px auto;border-radius: 39px;padding: 25px 25px 9px;box-sizing: border-box;border: 15px solid #f5f5f5;font-size: 15px;letter-spacing: .4px;box-shadow: 0px 0px 15px rgba(0,0,0,0.1);border-top: 4px solid #f18e27;border-bottom: 4px solid #f18e27;'><div style='text-align: center; border-bottom: 1px dashed #ccc;padding-bottom: 20px;'><img src='https://wekeza-profile-images.s3.amazonaws.com/white-logo.png'></div><p style='text-align: center;font-weight: 600;font-size: 19px;margin-bottom: 3px;'> Hello " + found.fname + " " + found.lname + ",</p></br><p style='text-align: center;padding-bottom: 17px;margin-bottom: 11px;display: inline-block;width: 100%;margin-top: 0;'> </p></br><p>You are receiving this OTP because you  have requested the reset of the password for your account." +
      "Please Check the OTP:</p></br>" +
      "<p>  " + link + " This is the OTP to reset your password.</p></br><p>If you did not request this, please ignore this email and your password will remain unchanged.</p><br><p style='background: #f9f9f9;padding: 10px;border-radius: 10px;text-align: center;Wekeza trading app.</p> ";
    const mail = await this.mailService.sendEmail(email, head, "Reset Your Password");
    return found.user_id;
  };

  public async contactUs(userData: contactUsDto): Promise<any> {

    let htmldata = "<span  style='display: block; width: 500px;margin: 0 auto; box-shadow: 0px 0px 10px #ccc; border-radius: 20px; padding: 30px 30px; border-top: 5px solid #4678f8; border-bottom: 5px solid #4678f8;background-repeat: no-repeat; background-position-x: right;background-position-y: top;background-size: 250px; box-shadow: 0px 0px 15px #ccc;'><p style='margin-top: 120px; font-size='16px''>Dear " + userData.fullname + ",</p> <p style='font-size='16px''>Thank you for Contacting Wekeza trading app.";


    const mail = await this.mailService.sendEmail(userData.email, htmldata, "Contact Mail"); // 

    return mail;
  };

  public async resetPassword(userData: resetPasswordDto): Promise<any> {

    const found = await DB(T.ER_SIGNUP).where('user_id', userData.user_id).first();
    if (!found) throw new HttpException(409, 'Unable to find user with user id: ' + userData.user_id + '. Please put request again for forgot password');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const update = await DB(T.ER_SIGNUP).update({ 'password': userData.password }).where('user_id', found.user_id);
    if (!update) throw new HttpException(409, 'Something Went Wrong..');

    return update;

  };

  public async TokenVerification(userData: resetPasswordDto): Promise<any> {

    const found = await DB(T.ER_SIGNUP).where('token_id', userData.token_id).andWhere('user_id', userData.user_id).first();
    if (!found) throw new HttpException(409, 'Token Does not matches' + userData.user_id + '. Please put request again for forgot password');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const update = await DB(T.ER_SIGNUP).update({ 'password': userData.password, 'token_id': '' }).where('user_id', found.user_id);
    if (!update) throw new HttpException(409, 'Something Went Wrong..');

    return update;

  };
}

export default UserService;
