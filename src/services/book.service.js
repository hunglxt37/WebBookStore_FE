import api from "@/utils/api";

const bookService = {
  async getAllBooks(params) {
    // Đảm bảo URL `/books` hoặc `/api/books` khớp với @RequestMapping ở Controller
    const response = await api.get("/books", { params });
    return response.data;
  },
  async getBookById(id) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async createBook(formData) {
    const response = await api.post("/books", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async updateBook(id, formData) {
    const response = await api.put(`/books/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteBook(id) {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

export default bookService;
