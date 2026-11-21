import express from 'express';
import serviciosRouter from './routes/servicios.routes.js';
import citasRouter from './routes/citas.routes.js';
import { manejarErrores } from './middlewares/errores.middleware.js';

const app = express();

app.use(express.json());

app.get('/api/salud', (req, res) => {
  res.json({ estado: 'ok', servicio: 'agendia-api' });
});

app.use('/api/servicios', serviciosRouter);
app.use('/api/citas', citasRouter);

app.use(manejarErrores);

export default app;