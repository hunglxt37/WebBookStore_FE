import api from "@/utils/api";

const userService = {
  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },
};

export default userService;
