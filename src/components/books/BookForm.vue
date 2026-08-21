<template>
    <v-form>

        <!-- ==================== TÊN + TÁC GIẢ ==================== -->
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field v-model="form.name" label="Tên sách" variant="outlined" density="comfortable" />
            </v-col>

            <v-col cols="12" md="6">
                <v-text-field v-model="form.author" label="Tác giả" variant="outlined" density="comfortable" />
            </v-col>
        </v-row>


        <!-- ==================== MÔ TẢ ==================== -->
        <v-textarea v-model="form.description" label="Mô tả" variant="outlined" rows="3" />


        <!-- ==================== GIÁ ==================== -->
        <v-row>

            <v-col cols="12" md="4">
                <v-text-field v-model.number="form.listPrice" label="Giá niêm yết" type="number" variant="outlined" />
            </v-col>

            <v-col cols="12" md="4">
                <v-text-field v-model.number="form.sellPrice" label="Giá bán" type="number" variant="outlined" />
            </v-col>

            <v-col cols="12" md="4">
                <v-text-field v-model.number="form.discountPercent" label="Giảm giá (%)" type="number"
                    variant="outlined" />
            </v-col>

        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <v-text-field v-model.number="form.quantity" label="Số lượng" type="number" variant="outlined" />
            </v-col>

            <v-col cols="12" md="6">
                <v-select v-model="form.genreIds" :items="genres" item-title="name" item-value="id" label="Thể loại"
                    multiple chips closable-chips variant="outlined" />
            </v-col>
        </v-row>



        <!-- ==================== HÌNH ẢNH ==================== -->
        <v-file-input v-model="selectedImage" label="Chọn hình ảnh" accept="image/*" prepend-icon="mdi-camera"
            variant="outlined" show-size @update:model-value="handleImage" />


        <!-- ==================== PREVIEW ẢNH ==================== -->
        <div v-if="imagePreviews.length" class="mt-3">

            <p class="text-subtitle-1 font-weight-medium mb-3">
                Hình ảnh đã chọn
            </p>

            <div class="d-flex flex-wrap ga-4">

                <div v-for="(image, index) in imagePreviews" :key="index" class="image-preview">

                    <!-- Ảnh -->
                    <v-img :src="image" width="120" height="120" cover rounded="lg" />

                    <!-- Nút xóa -->
                    <v-btn icon="mdi-close" size="x-small" color="red" class="remove-image"
                        @click="removeImage(index)" />

                </div>

            </div>

        </div>

    </v-form>
</template>


<script setup>

import { reactive, ref, watch } from "vue";


/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

const props = defineProps({

    /*
    |--------------------------------------------------------------------------
    | book
    |--------------------------------------------------------------------------
    | null  -> ADD
    | object -> EDIT
    |
    */

    book: {
        type: Object,
        default: null
    },


    /*
    |--------------------------------------------------------------------------
    | Danh sách thể loại
    |--------------------------------------------------------------------------
    */

    genres: {
        type: Array,
        default: () => []
    }

});


/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const form = reactive({

    name: "",
    author: "",
    description: "",

    listPrice: null,
    sellPrice: null,
    quantity: null,
    discountPercent: null,

    // Có thể chọn nhiều genre
    genreIds: [],

    // Lưu các File thật
    images: []

});


/*
|--------------------------------------------------------------------------
| Ảnh đang được chọn
|--------------------------------------------------------------------------
|
| v-file-input chỉ dùng biến này để chọn từng ảnh.
|
*/

const selectedImage = ref(null);


/*
|--------------------------------------------------------------------------
| Danh sách URL preview
|--------------------------------------------------------------------------
|
| Ví dụ:
|
| [
|   "blob:http://localhost/abc...",
|   "blob:http://localhost/xyz..."
| ]
|
*/

const imagePreviews = ref([]);


/*
|--------------------------------------------------------------------------
| Chọn ảnh
|--------------------------------------------------------------------------
*/

const handleImage = (file) => {

    // Không có file thì dừng
    if (!file) {
        return;
    }


    /*
    |--------------------------------------------------------------------------
    | 1. Lưu File thật vào form.images
    |--------------------------------------------------------------------------
    */

    form.images.push(file);


    /*
    |--------------------------------------------------------------------------
    | 2. Tạo URL để hiển thị preview
    |--------------------------------------------------------------------------
    */

    const previewUrl = URL.createObjectURL(file);

    imagePreviews.value.push(previewUrl);


    /*
    |--------------------------------------------------------------------------
    | 3. Reset ô chọn file
    |--------------------------------------------------------------------------
    |
    | Sau khi chọn xong ảnh:
    | ô upload sẽ trở lại trạng thái trống.
    |
    | Người dùng có thể chọn ảnh tiếp theo.
    |
    */

    selectedImage.value = null;

};


/*
|--------------------------------------------------------------------------
| Xóa ảnh
|--------------------------------------------------------------------------
*/

const removeImage = (index) => {

    /*
    |--------------------------------------------------------------------------
    | Giải phóng URL preview
    |--------------------------------------------------------------------------
    */

    URL.revokeObjectURL(
        imagePreviews.value[index]
    );


    /*
    |--------------------------------------------------------------------------
    | Xóa File khỏi form
    |--------------------------------------------------------------------------
    */

    form.images.splice(index, 1);


    /*
    |--------------------------------------------------------------------------
    | Xóa preview
    |--------------------------------------------------------------------------
    */

    imagePreviews.value.splice(index, 1);

};


/*
|--------------------------------------------------------------------------
| Reset preview
|--------------------------------------------------------------------------
*/

const clearImagePreviews = () => {

    /*
    | Giải phóng tất cả Object URL
    */

    imagePreviews.value.forEach((url) => {

        URL.revokeObjectURL(url);

    });


    /*
    | Xóa danh sách preview
    */

    imagePreviews.value = [];


    /*
    | Reset file input
    */

    selectedImage.value = null;

};


/*
|--------------------------------------------------------------------------
| Theo dõi props.book
|--------------------------------------------------------------------------
|
| book = null
| => ADD
|
| book = object
| => EDIT
|
*/

watch(
    () => props.book,

    (book) => {

        /*
        |--------------------------------------------------------------------------
        | ADD
        |--------------------------------------------------------------------------
        */

        if (!book) {

            Object.assign(form, {

                name: "",
                author: "",
                description: "",

                listPrice: null,
                sellPrice: null,
                quantity: null,
                discountPercent: null,

                genreIds: [],

                images: []

            });


            /*
            | Xóa preview
            */

            clearImagePreviews();

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | EDIT
        |--------------------------------------------------------------------------
        */

        Object.assign(form, {

            name: book.name ?? "",

            author: book.author ?? "",

            description: book.description ?? "",

            listPrice: book.listPrice ?? null,

            sellPrice: book.sellPrice ?? null,

            quantity: book.quantity ?? null,

            discountPercent: book.discountPercent ?? null,

            /*
            | Danh sách genre của sách
            */

            genreIds: book.genreIds ?? [],


            /*
            |--------------------------------------------------------------------------
            | Không đưa ảnh cũ vào v-file-input
            |--------------------------------------------------------------------------
            */

            images: []

        });


        /*
        | Xóa các preview ảnh mới
        */

        clearImagePreviews();

    },

    {
        immediate: true
    }

);

</script>


<style scoped>
.image-preview {
    position: relative;
    width: 120px;
    height: 120px;
}


.remove-image {
    position: absolute;
    top: 4px;
    right: 4px;
}
</style>