import { NextFunction, Request, Response } from 'express';
import AlpacaService from '../services/alpaca.services';


class AlpacaController {

    public alpacaService = new AlpacaService();

    public GetNews = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        try {

            const result = await this.alpacaService.getNews();
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error);
        }
    };

    public GetExchangeData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        try {
            console.log('exchnage data')
            const result = await this.alpacaService.getExchangeData();
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error);
        }
    };

    public SendNotification = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        try {
            let bodyForm = req.body.bodyform;
            const result = await this.alpacaService.sendNotification(bodyForm);
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error);
        }
    };

    public GetAlpacaMarketData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        try {
            let endPoint = req.body.url
            console.log(req.body.url)
            const result = await this.alpacaService.getAlpacaMarketData(endPoint);
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error);
        }
    };

    public GetAlpacaData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        try {
            let endPoint = req.body.url
            const result = await this.alpacaService.getAlpacaData(endPoint);
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error);
        }
    };

    public PostAlpacaData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        try {
            const result = await this.alpacaService.postAlpacaData(req.body);
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error);
        }
    };

    public DeleteAlpacaData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        try {
            const result = await this.alpacaService.deleteAlpacaData(req.body);
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error);
        }
    };

    public PutAlpacaData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        try {
            const result = await this.alpacaService.putAlpacaData(req.body);
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error);
        }
    };

}

export default AlpacaController