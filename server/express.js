import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes/routes.js';
import bodyParser from 'body-parser';

const app = express();

// Enable 'trust proxy' to allow Express to trust headers set by proxies
app.set('trust proxy', true);
// cors optiosns
const cors_options = {
  origin:
    process.env.NODE_ENV === 'production'
      ? []
      : ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
};






app.use(cors(cors_options));
app.use(bodyParser.json())


app.use(morgan('dev')); //log http requests with 'dev' format

app.use('/api', router);

export default app;
