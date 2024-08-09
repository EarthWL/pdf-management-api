import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import routeV1 from './routes/api-v1.js';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
// import { apiKeyMiddleware } from './middleware/apiKeyAuth.js';
import http from 'http'; 

dotenv.config();

const app = express();

// Create a rate limiter middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());
app.use(apiLimiter);

// Use the API key middleware for all routes under '/api/v1'
// app.use('/api/v1', apiKeyMiddleware);

// Use the route module with prefix
app.use('/api/v1', routeV1);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PDF Fill-Form Service',
      version: '1.0',
    },
  },
  apis: ['./index.mjs', './routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Create an HTTP server
const server = http.createServer(app);

app.all('*', function(req, res){
    res.status(404).send('Error: Not Found');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
