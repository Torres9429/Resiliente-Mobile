import api from "./api"; 

const endpoint = "/meseros";

export const crearMesero = async (meseroDto) => {
  console.log('recibe: ', meseroDto);
  console.log(api.defaults.baseURL+endpoint)
  return await api.post(endpoint, meseroDto);
};

export const obtenerMeseroPorId = async (id) => {
  return await api.get(`${endpoint}/${id}`);
};

export const obtenerTodosLosMeseros = async () => {
    console.log("api: ",api.defaults.baseURL + endpoint);
  return await api.get(endpoint); 
 
};

export const obtenerMeserosPorCondicion = async (condicionId) => {
  return await api.get(`${endpoint}/condicion/${condicionId}`);
};

export const obtenerMeserosPorEstado = async (status) => {
  return await api.get(`${endpoint}/estado/${status}`);
};

export const actualizarMesero = async (id, meseroDto) => {
  return await api.put(`${endpoint}/${id}`, meseroDto);
};

export const cambiarEstadoMesero = async (id, status) => {
  return await api.patch(`${endpoint}/${id}/estado/${status}`);
};

export const eliminarMesero = async (id) => {
  return await api.delete(`${endpoint}/${id}`);
};
export const meserosActivos = async () => {
  return await api.get(`${endpoint}/activos`);
};
export const meserosInactivos = async () => {
  return await api.get(`${endpoint}/inactivos`);
};
