import { Router } from 'express';
import AlpacaController from '../controllers/alpaca.controller';
import Route from '../interfaces/routes.interface';
import auth from '../middlewares/auth.middleware';


class AlpcaRoute implements Route {

    public path = '/alpaca';
    public router = Router();
    public alpacaController = new AlpacaController();


    constructor() {

        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get(`${this.path}/getnews`, auth, this.alpacaController.GetNews);
        this.router.get(`${this.path}/getexchangeData`, auth, this.alpacaController.GetExchangeData);
        this.router.post(`${this.path}/getalpacamarketdata`, auth, this.alpacaController.GetAlpacaMarketData);
        this.router.post(`${this.path}/getalpacadata`, auth, this.alpacaController.GetAlpacaData);
        this.router.post(`${this.path}/postalpacadata`, auth, this.alpacaController.PostAlpacaData);
        this.router.post(`${this.path}/deletealpacadata`, auth, this.alpacaController.DeleteAlpacaData);
        this.router.post(`${this.path}/putalpacadata`, auth, this.alpacaController.PutAlpacaData);


        this.router.post(`${this.path}/sendnotification`, auth, this.alpacaController.SendNotification);



    }

}

export default AlpcaRoute;
