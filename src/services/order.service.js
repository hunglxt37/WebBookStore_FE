import api from "@/utils/api";

const orderService = {
  async getMyOrder() {
    const res = await api.get("/orders/my-orders");
    return res.data;
  },

  async getAllOrdersForAdmin() {
    const res = await api.get("/orders");
    return res.data;
  },

  async createOrder(data) {
    const res = await api.post("/orders", data);
    return res.data;
  },

  async cancelOrder(id, reason) {
    const res = await api.put("/orders/cancel-order", { id, reason });
    return res.data;
  },

  async updateOrderStatus(id, status) {
    const res = await api.put("/orders/update-status-order", { id, status });
    return res.data;
  },

  async getOrderById(id) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
};

export default orderService;
