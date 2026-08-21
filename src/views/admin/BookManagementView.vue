<template>
    <div class="ma-4">
        <!-- title -->
        <!-- Top Card: Tiêu đề và Nút thao tác -->
        <v-card elevation="1" rounded="lg">
            <div class="d-flex justify-space-between align-center pa-4 mb-4">
                <div>
                    <h1 class="text-h4 font-weight-bold ma-0">
                        Quản Lý Sách
                    </h1>

                    <p class="text-body-2 text-grey-darken-1 mt-1 mb-0">
                        Trang quản lý sách hiệu quả dễ sử dụng
                    </p>
                </div>

                <div class="d-flex align-center ga-3">
                    <!-- Genre -->
                    <v-select v-model="selectedGenre" :items="genres" item-title="name" item-value="id"
                        variant="outlined" density="compact" hide-details style="width: 160px"
                        @update:model-value="handleGenreChange" />

                    <!-- Add book -->
                    <v-btn color="orange" prepend-icon="mdi-plus" height="40" elevation="0" @click="createBook">
                        Thêm Mới Sách
                    </v-btn>
                </div>
            </div>



            <AppDataTable :headers="headers" :items="bookStore.books" :page="bookStore.page + 1"
                :items-per-page="bookStore.size" :items-length="bookStore.totalItems"
                @update:page="bookStore.changePage" @update:items-per-page="bookStore.changeSize">
                <!-- Index -->   
                <template v-slot:item.index="{ index }">
                    {{ index + 1 }}
                </template>

                <!-- Hình ảnh -->
                <template v-slot:item.thumbnailUrl="{ item }">
                    <v-img :src="item.thumbnailUrl" width="50" height="70" cover
                        class="my-2 rounded-sm mx-auto bg-grey-lighten-2"></v-img>
                </template>

                <!-- Tên sách và tác giả -->
                <template v-slot:item.name="{ item }">
                    <div class="font-weight-bold text-subtitle-1">{{ item.name }}</div>
                    <div class="text-caption text-grey-darken-1">{{ item.author }}</div>
                </template>

                <!-- Thể loại -->
                <template v-slot:item.genres="{ item }">
                    <div class="d-flex flex-wrap gap-1 mt-1">
                        <v-chip v-for="genre in item.genres" :key="genre" size="x-small" color="primary" variant="flat"
                            class="me-1">
                            {{ genre }}
                        </v-chip>
                    </div>
                </template>

                <!-- Giá -->
                <template v-slot:item.sellPrice="{ item }">
                    <p class="text-error font-weight-bold">{{ item.sellPrice?.toLocaleString('vi-VN') }} ₫</p>
                </template>

                <!-- Hành động -->
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex justify-center ga-2">
                        <AppButton color="info" variant="outlined" text="Xem chi tiết" @click="detailBook(item)" />
                        <AppButton color="warning" variant="flat" text="Cập nhập" @click="updateBook(item)" />
                        <AppButton color="error" variant="flat" text="Xóa" @click="deleteBook(item)" />
                    </div>
                </template>
            </AppDataTable>


        </v-card>

        <CreateUpdateBook v-model="showModal" :mode="mode" :book="selectedBook" :genres="genreStore.genres"
            @save="handleSaveBook" />
        <DetailDeleteBook v-model="showDetailDeleteModal" :mode="detailDeleteMode" :book="selectedBook"
            @delete="handleDeleteBook" />
    </div>


</template>
<script setup>
import CreateUpdateBook from '@/components/books/CreateUpdateBook.vue';
import DetailDeleteBook from '@/components/books/DetailDeleteBook.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppDataTable from '@/components/common/AppDataTable.vue';
import { useBookStore } from '@/stores/book.store';
import { useGenreStore } from '@/stores/genre.store';
import { computed, onMounted, ref } from 'vue';

const bookStore = useBookStore()
const genreStore = useGenreStore()
const selectedGenre = ref()
const selectedBook = ref(null)

const showModal = ref(false)
const mode = ref('create')


const showDetailDeleteModal = ref(false)
const detailDeleteMode = ref('detail')


const headers = [
    { title: '#', key: 'index', sortable: false, align: 'center' },
    { title: 'Hình ảnh', key: 'thumbnailUrl', sortable: false, align: 'center' },
    { title: 'Tên sách và tác giả', key: 'name', sortable: true, align: 'start' },
    { title: 'Thể loại', key: 'genres', sortable: false, align: 'start' },
    { title: 'Giá', key: 'sellPrice', sortable: true, align: 'end' },
    { title: 'Hành động', key: 'actions', sortable: false, align: 'center' }
]

const genres = computed(() => [
    {
        id: null,
        name: "All Genres"
    },
    ...(Array.isArray(genreStore.genres) ? genreStore.genres : [])

])


onMounted(() => {
    bookStore.fetchBooks();
    genreStore.getAllGenre()
});

const createBook = () => {
    mode.value = 'create';
    selectedBook.value = null;
    showModal.value = true;
}

const detailBook = async (item) => {
    await bookStore.fetchBookById(item.id)

    const bookDetail = bookStore.book?.data || bookStore.book

    selectedBook.value = { ...bookDetail }

    detailDeleteMode.value = 'detail'

    showDetailDeleteModal.value = true
}

const updateBook = async (item) => {
    // Gọi API lấy dữ liệu chi tiết sách (chứa quantity, images, genres detail,...)
    await bookStore.fetchBookById(item.id);

    // Do response JSON của bạn bọc trong "data" ({ data: {...}, success: true })
    const bookDetail = bookStore.book?.data || bookStore.book;

    mode.value = 'update';
    selectedBook.value = { ...bookDetail }; // Đẩy data đầy đủ vào Form
    showModal.value = true;
}

const deleteBook = (item) => {
    selectedBook.value = item
    detailDeleteMode.value = 'delete'
    showDetailDeleteModal.value = true
}

const handleDeleteBook = async (book) => {
    if (!book?.id) return

    await bookStore.deleteBook(book.id)
    showDetailDeleteModal.value = false
    selectedBook.value = null
    await bookStore.fetchBooks()
}

const handleSaveBook = async (formData) => {
    // Kiểm tra xem mình đang ở chế độ nào
    if (mode.value === 'create') {
        // 1. GỌI API CREATE Ở ĐÂY
        await bookStore.createBook(formData);
        console.log("Đã tạo mới thành công");
    } else {
        // 2. GỌI API UPDATE Ở ĐÂY (nhớ kèm theo ID của sách cũ)
        await bookStore.updateBook(selectedBook.value.id, formData);
        console.log("Đã cập nhật thành công");
    }

    // 3. Sau khi gọi API xong thì làm 2 việc:
    showModal.value = false; // Đóng Form lại
    bookStore.fetchBooks();  // Tải lại danh sách sách ở Table cho mới
}
</script>


<style scoped>
:deep(.v-table--hover tbody tr:hover) {
    background-color: blanchedalmond !important;
    cursor: pointer;
}

/* Tùy chỉnh màu nền và in đậm cho thanh tiêu đề của bảng */
:deep(thead th) {
    background-color: #1867c0 !important;
    /* Màu xanh dương (primary) */
    color: white !important;
    /* Chữ màu trắng để nổi bật trên nền xanh */
    font-weight: bold !important;
    /* In đậm chữ */
    font-size: 14px !important;
    /* Tăng cỡ chữ lên 1 chút cho dễ đọc */
}
</style>
