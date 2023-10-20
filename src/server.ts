
import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import AuthRoute from './routes/auth.route';
import AlpcaRoute from './routes/alpaca.route';

validateEnv();

const app = new App([new AuthRoute(), new AlpcaRoute()]);

app.listen();
