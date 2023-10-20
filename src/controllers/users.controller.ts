
import { NextFunction, Request, Response } from 'express';
import { contactUsDto, CreateUserDto, resetPasswordDto, UpdateUserDto, ChangePasswordDto, storeTrendingDto } from '../dtos/users.dto';
import { User } from '../interfaces/users.interface';
import { Stocks } from '../interfaces/tending.interface';
import userService from '../services/users.service';
import MailService from '../services/mail.service';
import { storeAlpacaDto, AlpacaUserDto } from '../dtos/admin.dto';
import { uploadToAws } from '../utils/util';


class UsersController {

  public userService = new userService();
  public mailService = new MailService();

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);
      res.status(201).json({ data: createUserData, message: 'User account created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public storeAlpacadata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const userData: storeAlpacaDto = req.body;
      const storeData: User = await this.userService.storeAlpaca(userData);
      res.status(201).json({ data: storeData, message: 'Data Stored successfully' });
    } catch (error) {
      next(error);
    }
  };

  public sendmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const mailData = req.body;
      this.mailService.sendEmail(mailData.email, mailData.mailData, mailData.subject);
      res.status(201).json({ message: 'mail Send' });
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const userData: ChangePasswordDto = req.body;
      const result = await this.userService.changePassword(userData);
      res.status(200).json({ data: result, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public trendingData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const userData: storeTrendingDto = req.body;
      const storeData: Stocks = await this.userService.trendingData(userData);
      res.status(201).json({ data: storeData, message: 'Data Stored successfully' });
    } catch (error) {
      next(error);
    }
  };

  public toptraendingdata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const stkdata: Stocks[] = await this.userService.toptraendingdata();
      res.status(201).json({ data: stkdata, message: 'Data Retrieved', status: '1' });
    } catch (error) {
      next(error);
    }
  };

  public images = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const imagepath = req['files'];
      res.status(201).json({ imagepath: imagepath, message: 'success' });
    } catch (error) {
      next(error);
    }
  }

  public uploadResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      let myFile = req.body.myFile;
      let file_name = req.body.filename;
      let file_ext = req.body.extension;
      const datafile = await uploadToAws(myFile, file_ext, file_name);
      res.status(201).json({ data: datafile.Location, message: 'success' });
    } catch (error) {
      next(error);
    }
  }

  public getPlaidlinktoken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const Data = await this.userService.getPlaidlinktoken();
      res.status(201).json({ data: Data });
    } catch (error) {
      next(error);
    }
  };

  public set_access_token = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      let public_token = req.body.public_token;
      const Data = await this.userService.set_access_token(public_token);
      res.status(201).json({ token: Data.access_token, item_id: Data.item_id, error: 'Testing' });
    } catch (error) {
      next(error);
    }
  };

  public getPlaidaccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      let access_token = req.body.access_token;
      const Data = await this.userService.getPlaidaccount(access_token);
      res.status(201).json({ data: Data, message: 'account' });
    } catch (error) {
      next(error);
    }
  };

  public createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

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
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const userData: UpdateUserDto = req.body;
      const result = await this.userService.update(userData);
      res.status(200).json({ data: result, message: 'update' });
    } catch (error) {
      next(error);
    }
  };

  public updateAlpaca = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      console.log(req.body)
      const alpacaData: AlpacaUserDto = req.body;
      const result = await this.userService.updateAlpaca(alpacaData);
      res.status(200).json({ data: result, message: 'update' });
    } catch (error) {
      next(error);
    }
  };

  public contactUsMail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const mailinfo: contactUsDto = req.body;
      const result = await this.userService.contactUs(mailinfo);
      res.status(200).json({ data: result, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public forgotMail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      const email = req.body.email;
      const result = await this.userService.forgotPassword(email);
      res.status(200).json({ data: result, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public ResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      const userData: resetPasswordDto = req.body;
      const result = await this.userService.resetPassword(userData);
      res.status(200).json({ data: result, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const userData = req.body;
      const { findUser, acc } = await this.userService.login(userData);
      res.status(200).json({ data: findUser, account: acc, message: 'login success' });
    } catch (error) {
      next(error);
    }
  };

  public TokenVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      const userData: resetPasswordDto = req.body;
      const result = await this.userService.TokenVerification(userData);
      res.status(200).json({ data: result, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public getKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      let Username = process.env.AlPACA_USERNAME;
      let Password = process.env.AlPACA_PASSWORD;
      let Notification = process.env.NOTIFICATION;
      let WesocketUrl = process.env.WEBSOCKET_URL;
      let WekezaVideoUrl = process.env.WEKEZA_VIEDO_URL;
      const key = { "Username": Username, "Password": Password, "Notification": Notification, "Websocketurl": WesocketUrl, "Wekezavideourl": WekezaVideoUrl };
      res.status(201).json({ data: key, message: 'Data Retrieved', status: '1' });
    } catch (error) {
      next(error);
    }
  };

}

export default UsersController;
