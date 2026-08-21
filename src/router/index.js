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
          // component: LoginView,
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
          path: "",
          alias: "/books",
          name: "books",
          component: () => import("@/views/customer/BookView.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: "Danh Sách Sách",
          },
        },
        {
          path: "books/:id",
          name: "book-detail",
          component: () => import("@/views/customer/BookDetailView.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: "Chi tiết sách",
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
    return { name: "/" };
  }

  // Redirect authenticated users away from login page
  if (to.name === "login" && token && authStore.userInfo) {
    if (authStore.isAdmin) {
      return { name: "dashboard" };
    } else {
      return { name: "/" };
    }
  }
});
export default router;
