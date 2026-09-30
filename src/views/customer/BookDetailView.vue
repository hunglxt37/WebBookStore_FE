<template>
    <v-container class="py-6">
        <v-row v-if="bookStore.book">
            <!-- Ảnh sách -->
            <v-col cols="12" md="5">
                <book-image :images="bookStore.book.images" />
            </v-col>

            <!-- Thông tin sách & nút mua -->
            <v-col cols="12" md="7">
                <book-info :book="bookStore.book" @them-gio-hang="handleAddToCart" @mua-ngay="handleBuyNow" />
            </v-col>
        </v-row>

        <!-- Thông tin chi tiết & Mô tả sản phẩm -->
        <v-row v-if="bookStore.book" class="mt-4">
            <v-col cols="12">
                <v-card class="pa-6 rounded-lg" elevation="1">
                    <h2 class="text-h6 font-weight-bold mb-4">Thông tin chi tiết</h2>

                    <v-table density="comfortable" class="spec-table mb-6">
                        <tbody>
                            <tr v-if="bookStore.book.author">
                                <td class="text-grey font-weight-medium" style="width: 200px">Tác giả</td>
                                <td class="font-weight-medium">{{ bookStore.book.author }}</td>
                            </tr>
                            <tr v-if="bookStore.book.genres && bookStore.book.genres.length">
                                <td class="text-grey font-weight-medium">Thể loại</td>
                                <td>
                                    <v-chip v-for="g in bookStore.book.genres" :key="g.id || g" size="small" color="primary" variant="tonal" class="me-1">
                                        {{ g.name || g }}
                                    </v-chip>
                                </td>
                            </tr>
                            <tr v-if="bookStore.book.isbn">
                                <td class="text-grey font-weight-medium">Mã ISBN</td>
                                <td>{{ bookStore.book.isbn }}</td>
                            </tr>
                            <tr>
                                <td class="text-grey font-weight-medium">Tình trạng kho</td>
                                <td>
                                    <v-chip :color="bookStore.book.quantity > 0 ? 'success' : 'error'" size="small" variant="tonal">
                                        {{ bookStore.book.quantity > 0 ? `Còn hàng (${bookStore.book.quantity} cuốn)` : 'Hết hàng' }}
                                    </v-chip>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-grey font-weight-medium">Trạng thái kinh doanh</td>
                                <td>
                                    <v-chip :color="bookStore.book.status === 'ACTIVE' ? 'success' : 'grey'" size="small" variant="flat">
                                        {{ bookStore.book.status === 'ACTIVE' ? 'Đang kinh doanh' : 'Tạm ngưng' }}
                                    </v-chip>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <v-divider class="mb-5" />

                    <h2 class="text-h6 font-weight-bold mb-3">Mô tả sản phẩm</h2>
                    <div class="book-description text-body-1 text-grey-darken-3">
                        <p v-if="bookStore.book.description" style="white-space: pre-line; line-height: 1.8;">
                            {{ bookStore.book.description }}
                        </p>
                        <p v-else class="text-grey italic">
                            Chưa có mô tả chi tiết cho sản phẩm này.
                        </p>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import BookImage from '@/components/books/detail/BookImage.vue';
import BookInfo from '@/components/books/detail/BookInfo.vue';
import { useBookStore } from '@/stores/book.store';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const bookStore = useBookStore();
const cartStore = useCartStore();
const authStore = useAuthStore();

onMounted(async () => {
    const id = route.params.id;
    await bookStore.fetchBookById(id);
});

const handleAddToCart = async ({ bookId, quantity }) => {
    if (!authStore.isLoggedIn) {
        toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
        router.push('/auth/login');
        return;
    }
    await cartStore.addToCart(bookId, quantity);
};

const handleBuyNow = async ({ bookId, quantity }) => {
    if (!authStore.isLoggedIn) {
        toast.info('Vui lòng đăng nhập để tiếp tục mua hàng.');
        router.push('/auth/login');
        return;
    }
    await cartStore.addToCart(bookId, quantity);
    router.push('/carts');
};
</script>

<style scoped>
.spec-table td {
    padding: 10px 16px;
    border-bottom: 1px solid #f0f0f0;
}
.book-description {
    font-size: 15px;
}
</style>
