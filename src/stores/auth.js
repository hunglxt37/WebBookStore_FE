import router from "@/router";
import authService from "@/services/auth.service";
import userService from "@/services/user.service";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { useCartStore } from "./cart.store";

const toast = useToast();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userInfo: null,
    loading: false,
  }),
  getters: {
    isAdmin: (state) => state.userInfo?.roles?.includes("ROLE_ADMIN"),
    isCustomer: (state) => state.userInfo?.roles?.includes("ROLE_CUSTOMER"),
    fullName: (state) => state.userInfo?.fullName,
    email: (state) => state.userInfo?.email,
    avatar: (state) => state.userInfo?.avatar,
    isLoggedIn: (state) => !!state.userInfo,
  },
  actions: {
    async getUserProfile() {
      try {
        const res = await userService.getProfile();
        this.userInfo = res.data;
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err?.response?.data || err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        this.userInfo = null;
      }
    },

    async login(form) {
      try {
        this.loading = true;
        const res = await authService.postLogin(form);
        localStorage.setItem("token", res.data.token);
        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }
        toast.success("Đăng nhập thành công.");

        await this.getUserProfile();

        const cartStore = useCartStore();
        await cartStore.fetchCart();

        // Điều hướng thông minh: ưu tiên query redirect nếu có
        const redirect = router.currentRoute.value.query.redirect;
        if (redirect) {
          router.push(redirect);
        } else if (this.isAdmin) {
          router.push({ name: "dashboard" });
        } else {
          router.push({ name: "home" });
        }
      } catch (err) {
        const serverMsg = err?.response?.data?.error?.message || err?.response?.data?.message;
        if (serverMsg) {
          toast.error(serverMsg);
        } else if (err?.response) {
          toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
        }
      } finally {
        this.loading = false;
      }
    },

    async register(form) {
      try {
        this.loading = true;
        await authService.postRegister(form);
        toast.success("Đăng ký tài khoản thành công! Vui lòng kiểm tra email kích hoạt tài khoản hoặc đăng nhập.");
        router.push({ name: "login" });
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.response?.data?.error?.message || "Đăng ký thất bại.");
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const token = localStorage.getItem("token");
      try {
        if (token) {
          await authService.postLogout({ token });
        }
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu logout:", error);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        this.userInfo = null;
        toast.success("Đăng xuất thành công.");
        router.push({ name: "home" });
      }
    },
  },
});
