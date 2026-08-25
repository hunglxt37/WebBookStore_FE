import api from "@/utils/api";

const cartService = {
  // GET /cart
  async getCart() {
    const res = await api.get("/cart");
    return res.data; 
  },

  // POST /cart
  async addToCart(bookId, quantity = 1) {
    const res = await api.post("/cart", { bookId, quantity });
    return res.data;
  },

  // PUT /cart/{cartItemId}?quantity=X
  async updateQuantity(cartItemId, quantity) {
    const res = await api.put(`/cart/${cartItemId}`, null, {
      params: { quantity }
    });
    return res.data;
  },

  // DELETE /cart/{cartItemId}
  async deleteCartItem(cartItemId) {
    const res = await api.delete(`/cart/${cartItemId}`);
    return res.data;
  },

  // DELETE /cart/clear
  async clearCart() {
    const res = await api.delete("/cart/clear");
    return res.data;
  },
};

export default cartService;
