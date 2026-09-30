import api from "@/utils/api";

const authService = {
  async postLogin(body) {
    const response = await api.post("/auth/login", body);
    return response.data;
  },

  async postRegister(body) {
    const response = await api.post("/auth/register", body);
    return response.data;
  },

  async postLogout(body) {
    const response = await api.post("/auth/logout", body);
    return response.data;
  },

  async activateAccount(token) {
    const response = await api.get(`/auth/activate?token=${token}`);
    return response.data;
  },
};

export default authService;
