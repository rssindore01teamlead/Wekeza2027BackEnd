"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const util_1 = require("../utils/util");
const index_schema_1 = __importStar(require("../database/index.schema"));
const mail_service_1 = __importDefault(require("../services/mail.service"));
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const util = require('util');
const APP_PORT = process.env.APP_PORT || 8000;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(',');
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',');
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
    constructor() {
        this.mailService = new mail_service_1.default();
    }
    async createUser(userData) {
        if (util_1.isEmpty(userData))
            throw new HttpException_1.default(400, "You're not userData");
        const findUser = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).where('email', userData.email).first();
        if (findUser)
            throw new HttpException_1.default(409, `You're email ${userData.email} already exists`);
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        userData.password = hashedPassword;
        const inserted = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).insert(userData).returning('*');
        if (inserted) {
            const textmail = "<span  style='display: block; width: 500px;margin: 0 auto; box-shadow: 0px 0px 10px #ccc; border-radius: 20px; padding: 30px 30px; border-top: 5px solid #4678f8; border-bottom: 5px solid #4678f8;background-repeat: no-repeat; background-position-x: right;background-position-y: top;background-size: 250px; box-shadow: 0px 0px 15px #ccc;'><p style='margin-top: 120px; font-size='16px''>Dear " + userData.fname + " " + userData.lname + ",</p> <p style='font-size='16px''>Thank you for registering with Wekeza trading app.";
            this.mailService.sendEmail(userData.email, textmail, 'Wekeza Signup');
        }
        return inserted[0];
    }
    ;
    async trendingData(userData) {
        if (util_1.isEmpty(userData))
            throw new HttpException_1.default(400, "Data is empty");
        const inserted = await index_schema_1.default(index_schema_1.T.ER_TRENDING_STOCKS).insert(userData).returning('*');
        return inserted[0];
    }
    ;
    async toptraendingdata() {
        const found = await index_schema_1.default.raw(`select distinct symbol,stock_name from trending_stocks where created_at between now()- INTERVAL '90 days' and now() limit 5`);
        // const found = await DB.select('symbol', 'stock_name').from('trending_stocks')
        //   .whereBetween('created_at', [DB.raw('now() - INTERVAL \'90 days\''), DB.raw('now()')])
        //   .distinct()
        //   .limit(5)
        //   .then((results) => {
        //     console.log(results);
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });
        return found;
    }
    ;
    async changePassword(userData) {
        const allowedKeys = ['user_id', 'password', 'newpassword'];
        const cleaned = util_1.cleanObj(userData, allowedKeys);
        let updated;
        const findUser = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).where('user_id', cleaned.user_id).first();
        if (!findUser) {
            console.log("in if");
            throw new HttpException_1.default(409, `You're user_id ${cleaned.user_id} not found`);
        }
        else {
            console.log("in else");
            const isPasswordMatching = await bcrypt_1.default.compare(cleaned.password, findUser.password);
            if (!isPasswordMatching)
                throw new HttpException_1.default(409, "Old password is incorrect");
            cleaned.newpassword = await bcrypt_1.default.hash(cleaned.newpassword, 10);
            updated = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).where('user_id', (cleaned.user_id)).update('password', cleaned.newpassword).returning('*');
        }
        return updated[0];
    }
    ;
    async storeAlpaca(userData) {
        if (util_1.isEmpty(userData))
            throw new HttpException_1.default(400, "Data is empty");
        const found = await this.getOne(Number(userData.user_id));
        if (!found)
            throw new HttpException_1.default(409, `User ${userData.user_id} doesn't exists`);
        const inserted = await index_schema_1.default(index_schema_1.T.ER_ALPACA_ACC).insert(userData).returning('*');
        return inserted[0];
    }
    ;
    async createAccount(userData) {
        // console.log(userData);
        // // const body = await alpaca.accounts.accountsPost(
        // //   userData
        // // );
        return null;
    }
    ;
    async getPlaidlinktoken() {
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
            console.log(configs);
            if (PLAID_REDIRECT_URI !== '') {
                configs['redirect_uri'] = PLAID_REDIRECT_URI;
            }
            if (PLAID_ANDROID_PACKAGE_NAME !== '') {
                configs['android_package_name'] = PLAID_ANDROID_PACKAGE_NAME;
            }
            const createTokenResponse = await client.linkTokenCreate(configs);
            console.log((createTokenResponse));
            prettyPrintResponse(createTokenResponse);
            return (createTokenResponse.data);
            //return tokenResponse;
        }
        catch (e) {
            return null;
        }
    }
    ;
    async set_access_token(token) {
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
            };
            return linktoken; //JSON.parse(tokenResponse);
        }
        catch (e) {
            return null;
        }
    }
    ;
    async getPlaidaccount(token) {
        try {
            console.log('infunctiom ' + token);
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
        }
        catch (e) {
            return null;
        }
    }
    ;
    async login(userData) {
        let finduser = {};
        if (util_1.isEmpty(userData))
            throw new HttpException_1.default(400, "You're not userData");
        let email = userData.email.toLowerCase();
        console.log('email ' + email);
        const findUser = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).whereRaw(`LOWER(email) LIKE ?`, [`${email}`]).first();
        if (!findUser)
            throw new HttpException_1.default(409, `You're email ${userData.email} not found`);
        const isPasswordMatching = await bcrypt_1.default.compare(userData.password, findUser.password);
        if (!isPasswordMatching)
            throw new HttpException_1.default(409, "You're password not matching");
        const acc = await index_schema_1.default(index_schema_1.T.ER_ALPACA_ACC).where(`user_id`, findUser.user_id);
        const token = jsonwebtoken_1.default.sign({ user_id: findUser.user_id }, process.env.JWT_SECRET);
        findUser.token_id = token;
        finduser = findUser;
        return { findUser, acc };
    }
    ;
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};Secure;SameSite=None`;
    }
    ;
    async update(data) {
        const allowedKeys = ['user_id', 'fname', 'lname', 'investing_type', 'job_title', 'annual_income', 'liquid_asset', 'funding_account', 'phone_no', 'street_address', 'city', 'state', 'postal_code', 'country', 'basic_info', 'profilepic', 'current_employer'];
        const cleaned = util_1.cleanObj(data, allowedKeys);
        const found = await this.getOne(Number(cleaned.user_id));
        if (!found)
            throw new HttpException_1.default(409, `User ${cleaned.id} doesn't exists`);
        const updated = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).where('user_id', Number(data.user_id)).update(cleaned).returning('*');
        return updated[0];
    }
    ;
    async updateAlpaca(data) {
        const allowedKeys = ['user_id', 'al_status'];
        const cleaned = util_1.cleanObj(data, allowedKeys);
        const found = await this.getOne(Number(cleaned.user_id));
        if (!found)
            throw new HttpException_1.default(409, `User ${cleaned.id} doesn't exists`);
        const updated = await index_schema_1.default(index_schema_1.T.ER_ALPACA_ACC).where('user_id', Number(data.user_id)).update(cleaned).returning('*');
        return updated[0];
    }
    ;
    async getOne(id) {
        const found = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).where('user_id', id).first();
        if (!found)
            throw new HttpException_1.default(409, 'Unable to find user with id: ' + id + '.');
        return found;
    }
    ;
    async forgotPassword(email) {
        let email1 = email.toLowerCase();
        const found = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).whereRaw(`LOWER(email) LIKE ?`, [`${email1}`]).first();
        if (!found)
            throw new HttpException_1.default(409, 'Unable to find user with email: ' + email + '.');
        console.log(found);
        let token_id = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        const update = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).update({ 'token_id': token_id }).where('user_id', found.user_id);
        if (!update)
            throw new HttpException_1.default(409, 'Something Went Wrong..');
        var link = token_id;
        let head = "<div style='width: 690px;margin: 20px auto;border-radius: 39px;padding: 25px 25px 9px;box-sizing: border-box;border: 15px solid #f5f5f5;font-size: 15px;letter-spacing: .4px;box-shadow: 0px 0px 15px rgba(0,0,0,0.1);border-top: 4px solid #f18e27;border-bottom: 4px solid #f18e27;'><div style='text-align: center; border-bottom: 1px dashed #ccc;padding-bottom: 20px;'><img src='https://wekeza-profile-images.s3.amazonaws.com/white-logo.png'></div><p style='text-align: center;font-weight: 600;font-size: 19px;margin-bottom: 3px;'> Hello " + found.fname + " " + found.lname + ",</p></br><p style='text-align: center;padding-bottom: 17px;margin-bottom: 11px;display: inline-block;width: 100%;margin-top: 0;'> </p></br><p>You are receiving this OTP because you  have requested the reset of the password for your account." +
            "Please Check the OTP:</p></br>" +
            "<p>  " + link + " This is the OTP to reset your password.</p></br><p>If you did not request this, please ignore this email and your password will remain unchanged.</p><br><p style='background: #f9f9f9;padding: 10px;border-radius: 10px;text-align: center;Wekeza trading app.</p> ";
        const mail = await this.mailService.sendEmail(email, head, "Reset Your Password");
        return found.user_id;
    }
    ;
    async contactUs(userData) {
        let htmldata = "<span  style='display: block; width: 500px;margin: 0 auto; box-shadow: 0px 0px 10px #ccc; border-radius: 20px; padding: 30px 30px; border-top: 5px solid #4678f8; border-bottom: 5px solid #4678f8;background-repeat: no-repeat; background-position-x: right;background-position-y: top;background-size: 250px; box-shadow: 0px 0px 15px #ccc;'><p style='margin-top: 120px; font-size='16px''>Dear " + userData.fname + " " + userData.lname + ",</p> <p style='font-size='16px''>Thank you for Contacting Wekeza trading app.";
        const mail = await this.mailService.sendEmail(userData.email, htmldata, "Contact Mail"); // 
        return mail;
    }
    ;
    async resetPassword(userData) {
        const found = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).where('user_id', userData.user_id).first();
        if (!found)
            throw new HttpException_1.default(409, 'Unable to find user with user id: ' + userData.user_id + '. Please put request again for forgot password');
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        userData.password = hashedPassword;
        const update = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).update({ 'password': userData.password }).where('user_id', found.user_id);
        if (!update)
            throw new HttpException_1.default(409, 'Something Went Wrong..');
        return update;
    }
    ;
    async TokenVerification(userData) {
        const found = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).where('token_id', userData.token_id).andWhere('user_id', userData.user_id).first();
        if (!found)
            throw new HttpException_1.default(409, 'Token Does not matches' + userData.user_id + '. Please put request again for forgot password');
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        userData.password = hashedPassword;
        const update = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).update({ 'password': userData.password, 'token_id': '' }).where('user_id', found.user_id);
        if (!update)
            throw new HttpException_1.default(409, 'Something Went Wrong..');
        return update;
    }
    ;
}
exports.default = UserService;
//# sourceMappingURL=users.service.js.map