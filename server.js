import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Load all API endpoints from the api directory
const apiDirectory = path.join(__dirname, 'api');
const endpoints = [];

fs.readdirSync(apiDirectory).forEach(file => {
  if (file.endsWith('.js')) {
    const { meta, onStart } = await import(`./api/${file}`);
    if (meta) {
      endpoints.push(meta);
      const route = meta.path.split('?')[0]; // Extract base route without query params
      app[meta.method.toLowerCase()](route, (req, res) => onStart({ req, res }));
    }
  }
});

// Endpoint to get API metadata
app.get('/api/endpoints', (req, res) => {
  res.json(endpoints);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});