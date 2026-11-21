import * as serviciosService from '../services/servicios.service.js';

export async function listarServicios(req, res) {
  res.json(await serviciosService.listar());
}

export async function obtenerServicio(req, res) {
  res.json(await serviciosService.buscarPorId(req.params.id));
}

export async function crearServicio(req, res) {
  const servicio = await serviciosService.crear(req.body);
  res.status(201).json(servicio);
}

export async function actualizarServicio(req, res) {
  res.json(await serviciosService.actualizar(req.params.id, req.body));
}

export async function eliminarServicio(req, res) {
  await serviciosService.eliminar(req.params.id);
  res.status(204).end();
}