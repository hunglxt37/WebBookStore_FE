import { defineStore } from "pinia";
import cartService from "@/services/cart.service";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    loading: false,
    selectedItemIds: [], // Chứa cartItemId được chọn để checkout
  }),

  getters: {
    // Kiểm tra giỏ hàng có trống không
    isEmpty: (state) => state.items.length === 0,

    // Tổng số lượng cuốn sách trong giỏ (Dùng cho Badge Header)
    totalQuantity: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    // Tổng tiền của toàn bộ giỏ hàng
    totalAmount: (state) => {
      return state.items.reduce((sum, item) => sum + (item.subTotal || item.sellPrice * item.quantity), 0);
    },

    // Danh sách các item được tick chọn
    selectedItems: (state) => {
      return state.items.filter((item) => state.selectedItemIds.includes(item.id));
    },

    // Tổng tiền của các item được tick chọn để mua
    selectedTotalAmount: (state) => {
      return state.items
        .filter((item) => state.selectedItemIds.includes(item.id))
        .reduce((sum, item) => sum + (item.subTotal || item.sellPrice * item.quantity), 0);
    },
  },

  actions: {
    // 1. Lấy danh sách giỏ hàng
    async fetchCart() {
      this.loading = true;
      try {
        const res = await cartService.getCart();
        this.items = res.data || [];
        // Mặc định chọn tất cả items để mua
        this.selectedItemIds = this.items.map(item => item.id);
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      } finally {
        this.loading = false;
      }
    },

    // 2. Thêm vào giỏ hàng
    async addToCart(bookId, quantity = 1) {
      this.loading = true;
      try {
        await cartService.addToCart(bookId, quantity);
        toast.success("Đã thêm sách vào giỏ hàng!");
        await this.fetchCart(); // Cập nhật lại giỏ hàng
        return true;
      } catch (error) {
        toast.error(error.response?.data?.message || "Thêm vào giỏ hàng thất bại!");
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 3. Cập nhật số lượng (+ / -)
    async updateQuantity(cartItemId, quantity) {
      if (quantity < 1) return;
      try {
        await cartService.updateQuantity(cartItemId, quantity);
        // Cập nhật ngay trong local state để UI mượt mà
        const item = this.items.find((i) => i.id === cartItemId);
        if (item) {
          item.quantity = quantity;
          item.subTotal = item.sellPrice * quantity;
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Cập nhật số lượng thất bại!");
        await this.fetchCart(); // Revert lại state nếu lỗi
      }
    },

    // 4. Xóa 1 sản phẩm khỏi giỏ
    async removeFromCart(cartItemId) {
      try {
        await cartService.deleteCartItem(cartItemId);
        this.items = this.items.filter((item) => item.id !== cartItemId);
        this.selectedItemIds = this.selectedItemIds.filter(id => id !== cartItemId);
        toast.success("Đã xóa sách khỏi giỏ hàng!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại!");
      }
    },

    // 5. Xóa toàn bộ giỏ hàng
    async clearCart() {
      try {
        await cartService.clearCart();
        this.items = [];
        this.selectedItemIds = [];
        toast.success("Đã làm trống giỏ hàng!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Làm trống giỏ hàng thất bại!");
      }
    },
  },
});
