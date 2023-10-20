"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("../services/users.service"));
const mail_service_1 = __importDefault(require("../services/mail.service"));
const util_1 = require("../utils/util");
class UsersController {
    constructor() {
        this.userService = new users_service_1.default();
        this.mailService = new mail_service_1.default();
        this.createUser = async (req, res, next) => {
            try {
                const userData = req.body;
                const createUserData = await this.userService.createUser(userData);
                res.status(201).json({ data: createUserData, message: 'User account created successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.storeAlpacadata = async (req, res, next) => {
            try {
                const userData = req.body;
                const storeData = await this.userService.storeAlpaca(userData);
                res.status(201).json({ data: storeData, message: 'Data Stored successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.sendmail = async (req, res, next) => {
            try {
                console.log('in controller');
                const mailData = req.body;
                console.log(mailData);
                this.mailService.sendEmail(mailData.email, mailData.mailData, mailData.subject);
                res.status(201).json({ message: 'mail Send' });
            }
            catch (error) {
                next(error);
            }
        };
        this.changePassword = async (req, res, next) => {
            try {
                console.log("in controll fun");
                const userData = req.body;
                const result = await this.userService.changePassword(userData);
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error);
            }
        };
        this.trendingData = async (req, res, next) => {
            try {
                const userData = req.body;
                const storeData = await this.userService.trendingData(userData);
                res.status(201).json({ data: storeData, message: 'Data Stored successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.toptraendingdata = async (req, res, next) => {
            try {
                const stkdata = await this.userService.toptraendingdata();
                res.status(201).json({ data: stkdata, message: 'Data Retrieved', status: '1' });
            }
            catch (error) {
                next(error);
            }
        };
        this.images = async (req, res, next) => {
            try {
                const imagepath = req['files'];
                console.log("inage " + imagepath);
                res.status(201).json({ imagepath: imagepath, message: 'success' });
            }
            catch (error) {
                next(error);
            }
        };
        this.uploadResource = async (req, res, next) => {
            try {
                let myFile = req.body.myFile;
                let file_name = req.body.filename;
                let file_ext = req.body.extension;
                const datafile = await util_1.uploadToAws(myFile, file_ext, file_name);
                res.status(201).json({ data: datafile.Location, message: 'success' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getPlaidlinktoken = async (req, res, next) => {
            try {
                const Data = await this.userService.getPlaidlinktoken();
                res.status(201).json({ data: Data });
            }
            catch (error) {
                next(error);
            }
        };
        this.set_access_token = async (req, res, next) => {
            try {
                let public_token = req.body.public_token;
                const Data = await this.userService.set_access_token(public_token);
                res.status(201).json({ token: Data.access_token, item_id: Data.item_id, error: 'Testing' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getPlaidaccount = async (req, res, next) => {
            try {
                let access_token = req.body.access_token;
                console.log('access-token ' + req.body.access_token);
                const Data = await this.userService.getPlaidaccount(access_token);
                console.log('account ' + Data);
                res.status(201).json({ data: Data, message: 'account' });
            }
            catch (error) {
                next(error);
            }
        };
        this.createAccount = async (req, res, next) => {
            try {
                const userData = {
                    "contact": {
                        "email_address": "cool_alpaca@example.com",
                        "phone_number": "555-666-7788",
                        "street_address": [
                            "20 N San Mateo Dr"
                        ],
                        "city": "San Mateo",
                        "state": "CA",
                        "postal_code": "94401",
                        "country": "USA"
                    },
                    "identity": {
                        "given_name": "John",
                        "family_name": "Doe",
                        "date_of_birth": "1990-01-01",
                        "tax_id": "666-55-4321",
                        "tax_id_type": "USA_SSN",
                        "country_of_citizenship": "USA",
                        "country_of_birth": "USA",
                        "country_of_tax_residence": "USA",
                        "funding_source": [
                            "employment_income"
                        ]
                    },
                    "disclosures": {
                        "is_control_person": false,
                        "is_affiliated_exchange_or_finra": false,
                        "is_politically_exposed": false,
                        "immediate_family_exposed": false,
                        "context": [
                            {
                                "context_type": "",
                                "company_name": "",
                                "company_street_address": "",
                                "company_city": "",
                                "company_state": "",
                                "company_country": "",
                                "company_compliance_email": ""
                            }
                        ]
                    },
                    "agreements": [
                        {
                            "agreement": "margin_agreement",
                            "signed_at": "2020-09-11T18:09:33Z",
                            "ip_address": "185.13.21.99"
                        },
                        {
                            "agreement": "account_agreement",
                            "signed_at": "2020-09-11T18:13:44Z",
                            "ip_address": "185.13.21.99"
                        },
                        {
                            "agreement": "customer_agreement",
                            "signed_at": "2020-09-11T18:13:44Z",
                            "ip_address": "185.13.21.99"
                        }
                    ],
                    "documents": [
                        {
                            "document_type": "identity_verification",
                            "document_sub_type": "passport",
                            "content": "QWxwYWNhcyBjYW5ub3QgbGl2ZSBhbG9uZS4=",
                            "mime_type": "image/jpeg"
                        }
                    ],
                    "trusted_contact": {
                        "given_name": "Jane",
                        "family_name": "Doe",
                        "email_address": "jane.doe@example.com"
                    }
                };
                const createUserData = await this.userService.createAccount(userData);
                res.status(201).json({ data: createUserData, message: 'User account created successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateUser = async (req, res, next) => {
            try {
                const userData = req.body;
                const result = await this.userService.update(userData);
                res.status(200).json({ data: result, message: 'update' });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateAlpaca = async (req, res, next) => {
            try {
                const alpacaData = req.body;
                const result = await this.userService.updateAlpaca(alpacaData);
                res.status(200).json({ data: result, message: 'update' });
            }
            catch (error) {
                next(error);
            }
        };
        this.contactUsMail = async (req, res, next) => {
            try {
                const mailinfo = req.body;
                const result = await this.userService.contactUs(mailinfo);
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error);
            }
        };
        this.forgotMail = async (req, res, next) => {
            try {
                const email = req.body.email;
                const result = await this.userService.forgotPassword(email);
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error);
            }
        };
        this.ResetPassword = async (req, res, next) => {
            try {
                const userData = req.body;
                const result = await this.userService.resetPassword(userData);
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error);
            }
        };
        this.logIn = async (req, res, next) => {
            try {
                console.log('in login' + JSON.stringify(req.body));
                const userData = req.body;
                //const { cookie, findUser } = await this.userService.login(userData);
                const { findUser, acc } = await this.userService.login(userData);
                //res.setHeader('Set-Cookie', [cookie]);
                res.status(200).json({ data: findUser, account: acc, message: 'login success' });
            }
            catch (error) {
                console.log('in catch ' + error);
                next(error);
            }
        };
        this.TokenVerification = async (req, res, next) => {
            try {
                const userData = req.body;
                const result = await this.userService.TokenVerification(userData);
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map