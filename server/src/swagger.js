import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API OYSTERCULT',
      version: '1.0.0',
      description: 'Documentation API pour le système de gestion OYSTERCULT',
      contact: {
        name: 'Support',
        email: 'support@oystercult.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Chemin vers les fichiers de routes
};

const specs = swaggerJsdoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { 
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API OYSTERCULT"
  }));
};
