import api from "./api";

const endpoint = "auth";

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password
    });
    //console.log("response authApi: ", response.data.datos);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post(`${endpoint}/logout`);
    return response;
  } catch (error) {
    throw error;
  }
};