import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../swagger.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import datasetRoutes from './routes/dataset.routes.js';
import recordRoutes from './routes/record.routes.js';
import queryRoutes from './routes/query.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/datasets', datasetRoutes);
app.use('/records', recordRoutes);
app.use('/queries', queryRoutes);


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});