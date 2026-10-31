import * as citasService from '../services/citas.service.js';

export function crearCita(req, res) {
  const cita = citasService.crear(req.body);
  res.status(201).json(cita);
}

export function listarCitas(req, res) {
  res.json(citasService.listar());
}

export function obtenerCita(req, res) {
  const id = Number(req.params.id);
  const cita = citasService.buscarPorId(id);

  if (!cita) {
    return res.status(404).json({ error: `No existe la cita con id ${id}` });
  }

  res.json(cita);
}

export function cambiarEstadoCita(req, res) {
  const id = Number(req.params.id);
  const cita = citasService.cambiarEstado(id, req.body.estado);

  if (!cita) {
    return res.status(404).json({ error: `No existe la cita con id ${id}` });
  }

  res.json(cita);
}

export function eliminarCita(req, res) {
  const id = Number(req.params.id);
  const eliminada = citasService.eliminar(id);

  if (!eliminada) {
    return res.status(404).json({ error: `No existe la cita con id ${id}` });
  }

  res.status(204).end();
}