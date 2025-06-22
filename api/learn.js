import api from "./api";

const endpoint = "/juegos";

export const crearJuego = async (juegoDto) => {
  return await api.post(endpoint, juegoDto);
};

export const obtenerJuegoPorId = async (id) => {
  return await api.get(`${endpoint}/${id}`);
};

export const obtenerTodaoLosJuegos = async () => {
  return await api.get(endpoint);
};

export const obtenerJuegosPorEstado = async (status) => {
  return await api.get(`${endpoint}/estado/${status}`);
};

export const actualizarJuego = async (id, juegoDto) => {
  return await api.put(`${endpoint}/${id}`, juegoDto);
};

export const cambiarEstadoJuego = async (id, status) => {
  return await api.patch(`${endpoint}/${id}/estado/${status}`);
};

export const eliminarJuego = async (id) => {
  return await api.delete(`${endpoint}/${id}`);
};
export const juegosActivos = async () => {
  return await api.get(`${endpoint}/activos`);
};
export const juegosInactivos = async () => {
  return await api.get(`${endpoint}/inactivos`);
};