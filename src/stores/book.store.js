import { defineStore } from "pinia";
import bookService from "@/services/book.service";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useBookStore = defineStore("book", {
  // lưu dữ liệu lấy từ BE
  state: () => ({
    // Dữ liệu API
    books: [],
    book: null,
    loading: false,

    // Dữ liệu Query phân trang & bộ lọc
    page: 0,
    size: 12,
    totalItems: 0,
    totalPages: 0,
    search: null,
    genreId: null,
    minPrice: null,
    maxPrice: null,
    rating: null,
    sortBy: "newest",
  }),

  getters: {
    hasBooks: (state) => state.books.length > 0,

    // Gộp tất cả state lọc thành 1 object params để gửi cho Backend
    queryParams: (state) => ({
      page: state.page,
      size: state.size,
      search: state.search || undefined,
      genreId: state.genreId ?? undefined,
      minPrice: state.minPrice ?? undefined,
      maxPrice: state.maxPrice ?? undefined,
      rating: state.rating ?? undefined,
      sortBy: state.sortBy,
    }),
  },

  actions: {
    // 1. Lấy danh sách sách
    async fetchBooks() {
      this.loading = true;
      try {
        const response = await bookService.getAllBooks(this.queryParams);
        const data = response.data;

        this.books = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = data.totalPages;
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Không thể tải danh sách sách");
      } finally {
        this.loading = false;
      }
    },

    async changePage(newPage) {
      this.page = newPage - 1;
      await this.fetchBooks();
    },

    async changeSize(newSize) {
      this.size = newSize;
      await this.fetchBooks();
    },

    async changeFilter(filters) {
      this.genreId = filters.genreId ?? null;
      this.minPrice = filters.minPrice ?? null;
      this.maxPrice = filters.maxPrice ?? null;
      this.rating = filters.rating ?? null;
      this.page = 0; // Lọc mới thì quay về trang 1 (index 0)
      await this.fetchBooks(); // Gọi lại API
    },

    async changeSort(newSort) {
      this.sortBy = newSort;
      this.page = 0;
      await this.fetchBooks();
    },

    // 5. Lấy 1 cuốn sách
  async fetchBookById(id) {
      this.loading = true;
      try {
        const response = await bookService.getBookById(id);
        this.book = response.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
  },

  async createBook(formData) {
    this.loading = true;
    try {
        // Đổi tên hàm bookService.create sao cho khớp với service của bạn
        const response = await bookService.createBook(formData);
        toast.success("Thêm mới sách thành công!");
        return response.data;
    } catch (error) {
        console.error(error);
        toast.error("Thêm mới thất bại");
    } finally {
        this.loading = false;
    }
  },


  async updateBook(id, formData) {
    this.loading = true;
    try {
        const response = await bookService.updateBook(id, formData);
        toast.success("Cập nhật sách thành công!");
        return response.data;
    } catch (error) {
        console.error(error);
        toast.error("Cập nhật thất bại");
    } finally {
        this.loading = false;
    }
  },

  async deleteBook(id) {
    this.loading = true;
    try {
        const response = await bookService.deleteBook(id);
        toast.success("Xóa sách thành công!");
        return response.data;
    } catch (error) {
        console.error(error);
        toast.error("Xóa sách thất bại");
        throw error;
    } finally {
        this.loading = false;
    }
  },

    async reset() {
      this.search = null;

      this.genreId = null;
      this.minPrice = null;
      this.maxPrice = null;
      this.rating = null;

      this.sortBy = "newest";

      this.page = 0;

      await this.fetchBooks();
    },
  }
});
