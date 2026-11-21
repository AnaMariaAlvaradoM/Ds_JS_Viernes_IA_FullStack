import { ErrorHttp } from '../lib/error-http.js';

export function manejarErrores(err, req, res, next) {
  if (err instanceof ErrorHttp) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }

  console.error(err);
  res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor' });
}