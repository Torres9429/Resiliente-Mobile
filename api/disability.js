import api from "./api";

const endpoint = "/condiciones";

export const crearCondicion = async (condicionDto) => {
  return await api.post(endpoint, condicionDto);
};

export const obtenerCondicionPorId = async (id) => {
  return await api.get(`${endpoint}/${id}`);
};

export const obtenerTodasLasCondiciones = async () => {
  return await api.get(endpoint);
};

export const obtenerCondicionesPorEstado = async (status) => {
  return await api.get(`${endpoint}/estado/${status}`);
};

export const actualizarCondicion = async (id, condicionDto) => {
  return await api.put(`${endpoint}/${id}`, condicionDto);
};

export const cambiarEstadoCondicion = async (id, status) => {
  return await api.patch(`${endpoint}/${id}/estado/${status}`);
};

export const eliminarCondicion = async (id) => {
  return await api.delete(`${endpoint}/${id}`);
};

export const condicionesActivas = async () => {
  return await api.get(`${endpoint}/activas`);
};
export const condicionesInactivas = async () => {
  return await api.get(`${endpoint}/inactivas`);
};