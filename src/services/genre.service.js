import api from "@/utils/api";

const genreService = {
  async getAllGenres(params) {
    const response = await api.get("/genres", { params });
    return response.data;
  },
  async getAllGenresNoPage() {
    const response = await api.get("/genres/all");
    return response.data;
  },
  async getById(id) {
    const response = await api.get(`/genres/${id}`);
    return response.data;
  },
  async createGenre(data) {
    const response = await api.post("/genres", data);
    return response.data;
  },
  async updateGenre(id, data) {
    const response = await api.put(`/genres/${id}`, data);
    return response.data;
  },
  async deleteGenre(id) {
    const response = await api.delete(`/genres/${id}`);
    return response.data;
  },
};
export default genreService;
