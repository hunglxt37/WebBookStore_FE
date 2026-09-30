import axios from "axios";
import { useToast } from "vue-toastification";
import { useLoadingStore } from "@/stores/loading";

const toast = useToast();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, // 30 giây cho các request thông thường
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const loadingStore = useLoadingStore();
    loadingStore.show();

    // Nếu request là upload file (multipart/form-data) thì tăng timeout lên 120 giây
    // vì upload ảnh lên Cloudinary có thể mất nhiều thời gian hơn
    if (config.data instanceof FormData) {
      config.timeout = 120000; // 120 giây cho upload file
    }

    // Thêm auth token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request
    console.log("Request:", config.method, config.url);
    return config;
  },
  (error) => {
    const loadingStore = useLoadingStore();
    loadingStore.hide();

    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const loadingStore = useLoadingStore();
    loadingStore.hide();

    // Transform response
    console.log(response);
    return response;
  },
  async (error) => {
    const loadingStore = useLoadingStore();
    loadingStore.hide();
    // Handle errors
    if (error.response) {
      switch (error.response.status) {
        case 401: {
          const originalRequest = error.config;
          // Bỏ qua nếu là request auth để tránh vòng lặp vô tận
          const isAuthEndpoint =
            originalRequest?.url?.includes("/auth/login") ||
            originalRequest?.url?.includes("/auth/refresh") ||
            originalRequest?.url?.includes("/auth/register");

          if (originalRequest && !isAuthEndpoint && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
              try {
                // Gọi API refresh token riêng biệt không qua interceptor
                const refreshResponse = await axios.post(
                  `${import.meta.env.VITE_API_URL}/auth/refresh`,
                  { refreshToken }
                );

                const newAccessToken = refreshResponse.data?.data?.token;
                const newRefreshToken = refreshResponse.data?.data?.refreshToken;

                if (newAccessToken) {
                  localStorage.setItem("token", newAccessToken);
                  if (newRefreshToken) {
                    localStorage.setItem("refreshToken", newRefreshToken);
                  }
                  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                  return api(originalRequest);
                }
              } catch (refreshErr) {
                console.error("Refresh token thất bại:", refreshErr);
              }
            }

            // Nếu không có refreshToken hoặc refresh thất bại:
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

            const currentPath = window.location.pathname + window.location.search;
            if (!window.location.pathname.includes("/auth/login")) {
              window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
            }
          }
          break;
        }
        case 403:
          // Forbidden
          toast.warning("Bạn không có quyền truy cập vào tài nguyên này.");
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          //toast.error("Không tìm thấy dữ liệu hoặc trang yêu cầu.");
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          toast.error("Lỗi hệ thống máy chủ. Vui lòng thử lại sau.");
          console.error("Server error");
          break;
      }
    } else if (error.request) {
      // Request made but no response
      toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.");
      console.error("No response from server");
    } else {
      // Error setting up request
      toast.error("Đã xảy ra lỗi: " + error.message);
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  },
);
export default api;
