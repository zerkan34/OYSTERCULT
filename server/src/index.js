import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { logger } from './utils/logger.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import setupSwagger from './swagger.js';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de Swagger UI
setupSwagger(app);

// Routes
app.use('/api', apiRouter);

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API OYSTERCULT',
    documentation: '/api-docs',
    status: 'online',
    version: '1.0.0'
  });
});

// Static files (si nécessaire)
app.use(express.static(join(__dirname, '../public')));

// Error handling
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
  logger.info(`Documentation API disponible sur http://localhost:${PORT}/api-docs`);
});

export default app;
