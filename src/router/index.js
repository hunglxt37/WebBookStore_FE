import { createRouter, createWebHistory } from "vue-router";

import CustomerLayout from "@/layouts/CustomerLayout.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";
import { useAuthStore } from "@/stores/auth";
import AdminLayout from "@/layouts/AdminLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //AUTH
    {
      path: "/auth",
      component: BlankLayout,
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("@/views/auth/LoginView.vue"),
        },
        {
          path: "register",
          name: "register",
          component: () => import("@/views/auth/RegisterView.vue"),
        },
      ],
    },

    //CUSTOMER
    {
      path: "/",
      component: CustomerLayout,
      children: [
        {
          path: "",
          alias: "/home",
          name: "home",
          component: () => import("@/views/customer/HomeView.vue"),
          meta: {
            breadcrumb: "Trang chủ",
          },
        },
        {
          path: "books",
          name: "books",
          component: () => import("@/views/customer/BookView.vue"),
          meta: {
            breadcrumb: "Danh Sách Sách",
          },
        },
        {
          path: "books/:id",
          name: "book-detail",
          component: () => import("@/views/customer/BookDetailView.vue"),
          meta: {
            breadcrumb: "Chi tiết sách",
          },
        },
        {
          path: "carts",
          name: "carts",
          component: () => import("@/views/customer/CartView.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "checkout",
          name: "checkout",
          component: () => import("@/views/customer/CheckoutView.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "order-history",
          name: "order-history",
          component: () => import("@/views/customer/OrderHistoryView.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("@/views/customer/ProfileView.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: "Hồ sơ cá nhân",
          },
        },
      ],
    },

    //ADMIN
    {
      path: "/admin",
      component: AdminLayout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("@/views/admin/DashboardView.vue"),
          meta: {
            requiresAuth: true,
            requiresAdmin: true,
          },
        },
        {
          path: "book-management",
          name: "book-management",
          component: () => import("@/views/admin/BookManagementView.vue"),
          meta: {
            requiresAuth: true,
            requiresAdmin: true,
          },
        },
        {
          path: "orders",
          name: "admin-orders",
          component: () => import("@/views/admin/OrderManagementView.vue"),
          meta: {
            requiresAuth: true,
            requiresAdmin: true,
          },
        },
        {
          path: "genre",
          name: "admin-genre",
          component: () => import("@/views/admin/GenreManagementView.vue"),
          meta: {
            requiresAuth: true,
            requiresAdmin: true,
          },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/components/common/NotFound.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("token");

  // Có token nhưng chưa có thông tin user
  if (token && !authStore.userInfo) {
    await authStore.getUserProfile();
  }

  if (to.meta.requiresAuth && !token) {
    return { name: "login" };
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: "home" };
  }

  // Redirect authenticated users away from login/register page
  if ((to.name === "login" || to.name === "register") && token && authStore.userInfo) {
    if (authStore.isAdmin) {
      return { name: "dashboard" };
    } else {
      return { name: "home" };
    }
  }
});

export default router;
