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
        console.log(this.userInfo);
      } catch (err) {
        console.log(err?.response?.data || err);
        localStorage.removeItem("token");
        this.userInfo = null;
      }
    },

    async login(form) {
      try {
        this.loading = true;
        const res = await authService.postLogin(form);
        localStorage.setItem("token", res.data.token);
        toast.success("Đăng nhập thành công.");

        await this.getUserProfile();

        const cartStore = useCartStore();
        await cartStore.fetchCart();
        if (this.isAdmin) {
          router.push({ name: "dashboard" });
        } else {
          router.push({ name: "home" });
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.response?.data?.error?.message || "Đăng nhập thất bại.");
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
        await authService.postLogout({ token });
        localStorage.removeItem("token");
        this.userInfo = null;
        toast.success("Đăng Xuất thành công.");
        router.push("/home");
      } catch (error) {
        toast.error("Đăng Xuất lỗi.");
      }
    },
  },
});
