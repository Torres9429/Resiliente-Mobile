import api from "./api";

const endpoint = "/senas";

export const crearSena = async (sena) => {
  return await api.post(endpoint, sena);
};

export const obtenerSenaPorId = async (id) => {
  return await api.get(`${endpoint}/${id}`);
};

export const obtenerTodasLasSenas = async () => {
  return await api.get(endpoint);
};

export const obtenerSenasPorEstado = async (status) => {
  return await api.get(`${endpoint}/estado/${status}`);
};

export const actualizarSena = async (id, sena) => {
  return await api.put(`${endpoint}/${id}`, SenaDto);
};

export const cambiarEstadoSena = async (id, sena) => {
  return await api.patch(`${endpoint}/${id}/estado/${status}`);
};

export const eliminarSena = async (id) => {
  return await api.delete(`${endpoint}/${id}`);
};

export const senasActivas = async () => {
  return await api.get(`${endpoint}/activas`);
};
export const senasInactivas = async () => {
  return await api.get(`${endpoint}/inactivas`);
};
