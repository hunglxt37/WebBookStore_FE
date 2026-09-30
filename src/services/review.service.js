import api from "@/utils/api";

const reviewService = {
  // Lấy danh sách đánh giá của một cuốn sách (có phân trang)
  async getReviewsByBook(bookId, params = { page: 0, size: 5 }) {
    const res = await api.get(`/reviews/book/${bookId}`, { params });
    return res.data;
  },

  // Lấy tổng quan điểm đánh giá và phân bố sao của cuốn sách
  async getReviewSummary(bookId) {
    const res = await api.get(`/reviews/book/${bookId}/summary`);
    return res.data;
  },

  // Gửi đánh giá cho một sản phẩm trong đơn hàng đã giao
  async createReview(data) {
    const res = await api.post("/reviews", data);
    return res.data;
  },

  // [ADMIN] Xóa một đánh giá vi phạm tiêu chuẩn
  async deleteReview(id) {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  },
};

export default reviewService;
