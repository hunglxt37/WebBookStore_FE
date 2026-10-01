import { defineStore } from "pinia";
import favoriteBookService from "@/services/favorite.service";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import router from "@/router";

const toast = useToast();

export const useFavoriteStore = defineStore("favorite", {
  state: () => ({
    favorites: [],       // Danh sách FavoriteBookResponse trả về từ BE
    favoriteBookIds: [], // Danh sách các bookId để kiểm tra nhanh O(1)
    loading: false,
  }),

  getters: {
    // Tổng số lượng sách yêu thích (phục vụ hiển thị badge trên Header)
    totalFavorites: (state) => state.favorites.length,
    // Kiểm tra danh sách có rỗng không
    isEmpty: (state) => state.favorites.length === 0,
    // Hàm getter kiểm tra xem 1 cuốn sách đã được thích chưa
    isFavorite: (state) => (bookId) => {
      return state.favoriteBookIds.includes(Number(bookId));
    },
  },

  actions: {    
    async fetchFavorites() {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        this.favorites = [];
        this.favoriteBookIds = [];
        return;
      }

      try {
        this.loading = true;
        const res = await favoriteBookService.getListFavorite();
        const list = res.data || [];
        this.favorites = list;
        this.favoriteBookIds = list.map(fav => fav.bookId);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        this.loading = false;
      }
    },

    async toggleFavorite(book) {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        toast.info("Vui lòng đăng nhập để lưu sách yêu thích!");
        router.push({ path: "/auth/login", query: { redirect: router.currentRoute.value.fullPath } });
        return;
      }

      const bookId = typeof book === "object" ? book.id : Number(book);
      const isCurrentlyFavorite = this.favoriteBookIds.includes(bookId);

      // Optimistic update
      if (isCurrentlyFavorite) {
        this.favoriteBookIds = this.favoriteBookIds.filter(id => id !== bookId);
        this.favorites = this.favorites.filter(fav => fav.bookId !== bookId);
      } else {
        this.favoriteBookIds.push(bookId);
      }

      try {
        if (isCurrentlyFavorite) {
          await favoriteBookService.removeFavorite(bookId);
          toast.info("Đã xóa khỏi danh sách yêu thích");
        } else {
          await favoriteBookService.addFavorite(bookId);
          await this.fetchFavorites();
          toast.success("Đã thêm vào danh sách yêu thích ❤️");
        }
      } catch (error) {
        // Rollback nếu có lỗi
        if (isCurrentlyFavorite) {
          this.favoriteBookIds.push(bookId);
        } else {
          this.favoriteBookIds = this.favoriteBookIds.filter(id => id !== bookId);
        }
        console.error("Error toggling favorite:", error);
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      }
    },
  },
});