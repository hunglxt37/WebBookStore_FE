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

// import api from "@/utils/api";

// // 1. Lấy danh sách toàn bộ sách (kèm bộ lọc/phân trang nếu có)
// export const getAllBooksApi = async (params) => {
//   const response = await api.get("/books", { params });
//   return response.data;
// };

// // 2. Lấy chi tiết sách theo ID
// export const getBookByIdApi = async (id) => {
//   const response = await api.get(`/books/${id}`);
//   return response.data;
// };

// // 3. Tạo mới sách (dùng FormData để upload ảnh/file)
// export const createBookApi = async (formData) => {
//   const response = await api.post("/books", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

// // 4. Cập nhật thông tin sách
// export const updateBookApi = async (id, formData) => {
//   const response = await api.put(`/books/${id}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

// // 5. Xóa sách theo ID
// export const deleteBookApi = async (id) => {
//   const response = await api.delete(`/books/${id}`);
//   return response.data;
// };