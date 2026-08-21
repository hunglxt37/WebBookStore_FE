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
  (error) => {
    const loadingStore = useLoadingStore();
    loadingStore.hide();
    // Handle errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          if (error.config && !error.config.url.includes("/auth/login")) {
            localStorage.removeItem("token");
            window.location.href = "/home";
            toast.warning(
              "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
            );
          }
          break;
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
