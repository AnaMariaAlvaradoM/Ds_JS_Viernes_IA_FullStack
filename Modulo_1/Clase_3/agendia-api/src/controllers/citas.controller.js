import * as citasService from '../services/citas.service.js';

export async function crearCita(req, res) {
  const cita = await citasService.crear(req.body);
  res.status(201).json(cita);
}

export async function listarCitas(req, res) {
  res.json(await citasService.listar());
}

export async function obtenerCita(req, res) {
  res.json(await citasService.buscarPorId(req.params.id));
}

export async function cambiarEstadoCita(req, res) {
  res.json(await citasService.cambiarEstado(req.params.id, req.body?.estado));
}

export async function eliminarCita(req, res) {
  await citasService.eliminar(req.params.id);
  res.status(204).end();
}