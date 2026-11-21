import { ErrorHttp } from './error-http.js';

export function leerId(valor, recurso) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorHttp(400, `El id de ${recurso} debe ser un número entero positivo (llegó "${valor}")`);
  }
  return id;
}

export function exigirTexto(datos, campo) {
  if (typeof datos[campo] !== 'string' || datos[campo].trim() === '') {
    throw new ErrorHttp(400, `El campo ${campo} es obligatorio y debe ser un texto`);
  }
}