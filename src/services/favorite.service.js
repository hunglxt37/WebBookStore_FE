import api from "@/utils/api";

export const favoriteBookService = {
  async getListFavorite() {
    const response = await api.get("/favorite-books");
    return response.data;
  },

  async addFavorite(bookId) {
    const response = await api.post(`/favorite-books/${bookId}`);
    return response.data;
  },

  async removeFavorite(bookId) {
    const response = await api.delete(`/favorite-books/${bookId}`);
    return response.data;
  },

  async isFavorite(bookId) {
    const response = await api.get(`/favorite-books/${bookId}`);
    return response.data;
  },
};

export default favoriteBookService;
