import prisma from '../lib/prisma.js';
import { ErrorHttp } from '../lib/error-http.js';
import { leerId, exigirTexto } from '../lib/validaciones.js';
import * as serviciosService from './servicios.service.js';

const ESTADOS = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'];

function validarCita(datos) {
  exigirTexto(datos, 'clienteNombre');
  exigirTexto(datos, 'clienteTelefono');
  exigirTexto(datos, 'profesional');
  if (typeof datos.fechaHora !== 'string' || Number.isNaN(Date.parse(datos.fechaHora))) {
    throw new ErrorHttp(400, 'fechaHora debe ser una fecha válida, por ejemplo "2026-11-07T15:00:00-05:00"');
  }
}

const MINUTO_MS = 60 * 1000;

function terminaEn(inicio, duracionMin) {
  return new Date(inicio.getTime() + duracionMin * MINUTO_MS);
}

async function verificarAgendaLibre(profesional, inicio, duracionMin) {
  const fin = terminaEn(inicio, duracionMin);
  const citas = await prisma.cita.findMany({
    where: { profesional, estado: { not: 'CANCELADA' } },
    include: { servicio: true },
  });
  const cruce = citas.find((cita) =>
    cita.fechaHora < fin && inicio < terminaEn(cita.fechaHora, cita.servicio.duracionMin));
  if (cruce) {
    throw new ErrorHttp(409, `${profesional} ya tiene la cita ${cruce.id} en ese horario`);
  }
}

export async function crear(datos = {}) {
  validarCita(datos);
  const servicio = await serviciosService.buscarPorId(datos.servicioId);
  const fechaHora = new Date(datos.fechaHora);
  await verificarAgendaLibre(datos.profesional, fechaHora, servicio.duracionMin);

  return prisma.cita.create({
    data: {
      servicioId: servicio.id,
      clienteNombre: datos.clienteNombre,
      clienteTelefono: datos.clienteTelefono,
      profesional: datos.profesional,
      fechaHora,
      notas: datos.notas,
    },
  });
}

export function listar() {
  return prisma.cita.findMany({ orderBy: { fechaHora: 'asc' } });
}

export async function buscarPorId(valorId) {
  const id = leerId(valorId, 'cita');
  const cita = await prisma.cita.findUnique({ where: { id } });

  if (!cita) throw new ErrorHttp(404, `No existe la cita con id ${id}`);
  return cita;
}

export async function cambiarEstado(valorId, estado) {
  const cita = await buscarPorId(valorId);
  if (!ESTADOS.includes(estado)) {
    throw new ErrorHttp(400, `El estado debe ser uno de: ${ESTADOS.join(', ')}`);
  }
  return prisma.cita.update({ where: { id: cita.id }, data: { estado } });
}

export async function eliminar(valorId) {
  const cita = await buscarPorId(valorId);
  await prisma.cita.delete({ where: { id: cita.id } });
}