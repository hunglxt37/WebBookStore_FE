<template>
    <footer class="footer text-white mt-5">
        <v-container class="py-5">
            <v-row>
                <!-- Logo -->
                <v-col cols="12" sm="6" md="6" lg="3">
                    <h3 class="font-weight-bold">Lumina Books</h3>
                    <p class="mt-3">
                        © 2026 Lumina Books.Mang tri thức đến mọi nhà.
                    </p>
                    <div class="d-flex ga-3 text-h5 mt-3 social-icons">
                        <v-icon icon="mdi-facebook" class="social-icon"></v-icon>
                        <v-icon icon="mdi-web" class="social-icon"></v-icon>
                        <v-icon icon="mdi-email" class="social-icon"></v-icon>
                    </div>
                </v-col>

                <!-- Discover -->
                <v-col cols="12" sm="6" md="3" lg="3">
                    <h5 class="font-weight-bold">Khám phá</h5>
                    <ul class="footer-links mt-3">
                        <li><a href="#">Về chúng tôi</a></li>
                        <li><a href="#">Hệ thống cửa hàng</a></li>
                        <li><a href="#">Tuyển dụng</a></li>
                    </ul>
                </v-col>

                <!-- Support -->
                <v-col cols="12" sm="6" md="3" lg="3">
                    <h5 class="font-weight-bold">Hỗ trợ</h5>
                    <ul class="footer-links mt-3">
                        <li><a href="#">Chính sách bảo mật</a></li>
                        <li><a href="#">Điều khoản sử dụng</a></li>
                        <li><a href="#">Liên hệ</a></li>
                    </ul>
                </v-col>

                <!-- Newsletter -->
                <v-col cols="12" md="6" lg="3">
                    <h5 class="font-weight-bold">Bản tin</h5>
                    <p class="mt-3">
                        Đăng ký nhận tin để không bỏ lỡ các ưu đãi mới nhất.
                    </p>
                    <div class="newsletter-group d-flex mt-3">
                        <input class="newsletter-input" placeholder="Email của bạn">
                        <v-btn color="warning" class="newsletter-btn" height="40">Gửi</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </footer>
</template>

<style scoped>
.footer {
    background: #08264d;
}

.footer-links {
    list-style: none;
    padding-left: 0;
}

.footer a {
    color: #d6d6d6;
    text-decoration: none;
    line-height: 35px;
}

.footer a:hover {
    color: white;
}

.social-icons {
    align-items: center;
}

.social-icon {
    cursor: pointer;
    transition: color 0.2s;
}

.social-icon:hover {
    color: #ffc107;
}

.newsletter-group {
    height: 40px;
    display: flex;
    align-items: center;
}

.newsletter-input {
    flex-grow: 1;
    height: 40px;
    border: 1px solid #ced4da;
    border-right: none;
    border-radius: 8px 0 0 8px;
    background: white;
    color: black;
    padding: 0 12px;
    outline: none;
    font-size: 0.95rem;
}

.newsletter-btn {
    border-radius: 0 8px 8px 0 !important;
    height: 40px !important;
    font-weight: bold !important;
    box-shadow: none !important;
}
</style>