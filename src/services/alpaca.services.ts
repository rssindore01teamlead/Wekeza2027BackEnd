
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
import axios from 'axios';



class AlpacaService {


    public async getNews(): Promise<any> {

        return axios({
            method: "get",
            url: process.env.NEWS_URL,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }).then((response) => {
            return response.data.data
        }).catch((error) => {
            throw new HttpException(409, error);
        });
    };

    public async getExchangeData(): Promise<any> {

        return axios({
            method: "get",
            url: process.env.MARKET_EXCHANGE,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }).then((response) => {
            return response.data
        }).catch((error) => {
            throw new HttpException(409, error);
        });
    };

    public async sendNotification(bodyFormData: any): Promise<any> {

        return axios({
            method: "post",
            url: process.env.NOTIFICATION_URL,
            data: bodyFormData,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Authorization': 'key=' + process.env.NOTIFICATION
            },
        }).then((response) => {
            return response.data
        }).catch((error) => {
            throw new HttpException(409, error);
        });
    };

    public async getAlpacaMarketData(endPoint: string): Promise<any> {

        return axios({
            method: "get",
            url: process.env.MARKET_URL + endPoint,
            auth: {
                username: process.env.AlPACA_USERNAME,
                password: process.env.AlPACA_PASSWORD
            }
        }).then((response) => {
            return response.data
        }).catch((error) => {
            throw new HttpException(409, error);
        });
    };

    public async getAlpacaData(endPoint: string): Promise<any> {
        console.log(process.env.ALPACA_URL + endPoint)
        return axios({
            method: "get",
            url: process.env.ALPACA_URL + endPoint,
            auth: {
                username: process.env.AlPACA_USERNAME,
                password: process.env.AlPACA_PASSWORD
            }
        }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log(error.response)
            throw new HttpException(409, error.response.data.message);
        });
    };

    public async postAlpacaData(bodyFormData: any): Promise<any> {

        const { url, ...dataWithoutUrl } = bodyFormData;
        return axios({
            method: "post",
            url: process.env.ALPACA_URL + bodyFormData.url,
            data: dataWithoutUrl,
            auth: {
                username: process.env.AlPACA_USERNAME,
                password: process.env.AlPACA_PASSWORD
            }
        }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log(error.response.data.message)
            throw new HttpException(409, error.response.data.message);
        });
    };

    public async deleteAlpacaData(bodyFormData: any): Promise<any> {

        //const { url, ...dataWithoutUrl } = bodyFormData;
        console.log(process.env.ALPACA_URL + bodyFormData.url)
        return axios({
            method: "delete",
            url: process.env.ALPACA_URL + bodyFormData.url,
            auth: {
                username: process.env.AlPACA_USERNAME,
                password: process.env.AlPACA_PASSWORD
            }
        }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log(error.response.data.message)
            throw new HttpException(409, error.response.data.message);
        });
    };

    public async putAlpacaData(bodyFormData: any): Promise<any> {

        const { url, ...dataWithoutUrl } = bodyFormData;
        return axios({
            method: "put",
            url: process.env.ALPACA_URL + bodyFormData.url,
            data: dataWithoutUrl,
            auth: {
                username: process.env.AlPACA_USERNAME,
                password: process.env.AlPACA_PASSWORD
            }
        }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log(error.response.data.message)
            throw new HttpException(409, error.response.data.message);
        });
    };


}

export default AlpacaService