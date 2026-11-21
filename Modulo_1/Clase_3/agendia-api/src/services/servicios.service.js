import prisma from '../lib/prisma.js';
import { ErrorHttp } from '../lib/error-http.js';
import { leerId, exigirTexto } from '../lib/validaciones.js';

function validarServicio(datos) {
  exigirTexto(datos, 'nombre');
  if (!Number.isInteger(datos.duracionMin) || datos.duracionMin <= 0) {
    throw new ErrorHttp(400, 'duracionMin debe ser un número entero mayor que 0');
  }
  if (!Number.isInteger(datos.precio) || datos.precio < 0) {
    throw new ErrorHttp(400, 'precio debe ser un número entero de 0 o más');
  }
}

export function listar() {
  return prisma.servicio.findMany({ orderBy: { id: 'asc' } });
}

export async function buscarPorId(valorId) {
  const id = leerId(valorId, 'servicio');
  const servicio = await prisma.servicio.findUnique({ where: { id } });
  if (!servicio) throw new ErrorHttp(404, `No existe el servicio con id ${id}`);
  return servicio;
}

export function crear(datos = {}) {
  validarServicio(datos);
  return prisma.servicio.create({
    data: { nombre: datos.nombre, descripcion: datos.descripcion, duracionMin: datos.duracionMin, precio: datos.precio },
  });
}

export async function actualizar(valorId, datos = {}) {
  const servicio = await buscarPorId(valorId);
  validarServicio(datos);
  return prisma.servicio.update({
    where: { id: servicio.id },
    data: { nombre: datos.nombre, descripcion: datos.descripcion, duracionMin: datos.duracionMin, precio: datos.precio },
  });
}

export async function eliminar(valorId) {
  const servicio = await buscarPorId(valorId);
  const citas = await prisma.cita.count({ where: { servicioId: servicio.id } });
  if (citas > 0) {
    throw new ErrorHttp(409, `No se puede eliminar "${servicio.nombre}": tiene ${citas} cita(s) registradas`);
  }
  await prisma.servicio.delete({ where: { id: servicio.id } });
}