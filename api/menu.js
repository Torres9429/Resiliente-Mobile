import api from "./api";

const endpoint = "/productos";

export const crearProducto = async (productoDto) => {
  return await api.post(endpoint, productoDto);
};

export const obtenerProductoPorId = async (id) => {
  return await api.get(`${endpoint}/${id}`);
};

export const obtenerTodosLosProductos = async () => {
  return await api.get(endpoint);
};

export const obtenerProductosPorEstado = async (status) => {
  return await api.get(`${endpoint}/estado/${status}`);
};

export const actualizarProducto = async (id, productoDto) => {
  return await api.put(`${endpoint}/${id}`, productoDto);
};

export const cambiarEstadoProducto = async (id, status) => {
  return await api.patch(`${endpoint}/${id}/estado/${status}`);
};

export const eliminarProducto = async (id) => {
  return await api.delete(`${endpoint}/${id}`);
};

export const productosActivos = async () => {
  return await api.get(`${endpoint}/activos`);
};
export const productosInactivos = async () => {
  return await api.get(`${endpoint}/inactivos`);
};