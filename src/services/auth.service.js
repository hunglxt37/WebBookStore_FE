import api from "@/utils/api";

const authService = {
  async postLogin(body) {
    const response = await api.post("/auth/login", body);
    return response.data;
  },

  async postLogout(body) {
    const response = await api.post("/auth/logout", body);
    return response.data;
  },
};

export default authService;
