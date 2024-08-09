import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next(); // Move on to the next middleware or route
}
