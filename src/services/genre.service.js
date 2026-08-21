import api from "@/utils/api";

const genreService = {
  async getAllGenres(params) {
    const response = await api.get("/genres", { params });
    return response.data;
  },
  async getById(id) {
    const response = await api.get(`/genres/${id}`);
    return response.data;
  },
};
export default genreService;
