<template>

    <v-dialog v-model="dialogModel" max-width="900px" scrollable>
        <v-card rounded="lg">

            <!-- Header -->
            <v-card-title class="d-flex align-center justify-space-between">
                <span class="text-h6 font-weight-bold">
                    {{ mode === 'create' ? 'Thêm Mới Sách' : 'Cập Nhật Sách' }}
                </span>

                <v-btn icon="mdi-close" variant="text" @click="close" />
            </v-card-title>

            <v-divider />

            <!-- ==================== TÊN + TÁC GIẢ ==================== -->
            <v-form>
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
                        <v-text-field v-model.number="form.listPrice" label="Giá niêm yết" type="number"
                            variant="outlined" />
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field v-model.number="form.sellPrice" label="Giá bán" type="number"
                            variant="outlined" />
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field v-model.number="form.discountPercent" label="Giảm giá (%)" type="number"
                            variant="outlined" />
                    </v-col>

                </v-row>

                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model.number="form.quantity" label="Số lượng" type="number"
                            variant="outlined" />
                    </v-col>

                    <v-col cols="12" :md="mode === 'update' ? 6 : 12">
                        <v-select v-model="form.genreIds" :items="genres" item-title="name" item-value="id"
                            label="Thể loại" multiple chips closable-chips variant="outlined" />
                    </v-col>

                    <v-col cols="12" md="6" v-if="mode === 'update'">
                        <v-select v-model="form.status" :items="[
                            { title: 'Đang bán (ACTIVE)', value: 'ACTIVE' },
                            { title: 'Tạm ngưng (INACTIVE)', value: 'INACTIVE' }
                        ]" label="Trạng thái kinh doanh" variant="outlined" />
                    </v-col>
                </v-row>



                <!-- ==================== HÌNH ẢNH ==================== -->
                <v-file-input v-model="selectedImage" label="Chọn hình ảnh" accept="image/*" prepend-icon="mdi-camera"
                    variant="outlined" show-size @update:model-value="handleImage" />


                <!-- ==================== ẢNH HIỆN TẠI (KHI CẬP NHẬT) ==================== -->
                <div v-if="mode === 'update' && book?.images?.length && !imagePreviews.length" class="mt-3 mb-4">
                    <p class="text-subtitle-1 font-weight-medium mb-3">Hình ảnh hiện tại</p>

                    <div class="d-flex flex-wrap ga-4">
                       
                                    <v-img v-for="image in book.images" :key="image.id" :src="image.urlImage"
                                        width="120" height="120" cover rounded="lg" class="bg-grey-lighten-2" />

                    </div>
                </div>

                <!-- ==================== PREVIEW ẢNH MỚI ==================== -->
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

            <v-divider />

            <!-- Footer -->
            <v-card-actions class="pa-4">
                <v-spacer />

                <v-btn variant="outlined" @click="close">
                    Hủy
                </v-btn>

                <AppButton @click="handleSave" :text="mode === 'create' ? 'Thêm mới' : 'Cập nhật'" />
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>



<script setup>

import { reactive, ref, watch, computed } from "vue";
import AppButton from "../common/AppButton.vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'create'
    },

    book: {
        type: Object,
        default: null
    },

    genres: {
        type: Array,
        default: () => []
    }

});

const emit = defineEmits(['update:modelValue', 'save']);

const dialogModel = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

const close = () => {
    dialogModel.value = false;
};

const handleSave = () => {
    // Xây dựng FormData chuẩn để gửi multipart/form-data lên Spring Boot
    const payload = new FormData();

    // ── Các field thông thường ──
    payload.append('name', form.name || '');
    payload.append('author', form.author || '');
    payload.append('description', form.description || '');
    payload.append('listPrice', form.listPrice ?? '');
    payload.append('sellPrice', form.sellPrice ?? '');
    payload.append('quantity', form.quantity ?? '');
    payload.append('discountPercent', form.discountPercent ?? '');
    if (form.status) {
        payload.append('status', form.status);
    }

    // ── Mảng thể loại: phải append từng phần tử riêng lẻ ──
    // Spring Boot đọc: @RequestParam List<Long> genreIds
    if (form.genreIds && form.genreIds.length > 0) {
        form.genreIds.forEach(id => payload.append('genreIds', id));
    }

    // ── Mảng ảnh: phải append từng File riêng lẻ ──
    // Spring Boot đọc: @RequestParam List<MultipartFile> images
    if (form.images && form.images.length > 0) {
        form.images.forEach(file => payload.append('images', file));
    }

    emit('save', payload);
};


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
    status: "ACTIVE",

    // Có thể chọn nhiều genre
    genreIds: [],

    // Lưu các File thật
    images: []

});




const selectedImage = ref(null);



const imagePreviews = ref([]);


const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Scale down nếu ảnh quá to
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);

                // Chuyển canvas thành File nén
                canvas.toBlob(
                    (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
                    'image/jpeg',
                    quality
                );
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};


const handleImage = async (file) => {

    // Không có file thì dừng
    if (!file) {
        return;
    }

    const compressedFile = await compressImage(file);
    form.images.push(compressedFile);

    const previewUrl = URL.createObjectURL(file);

    imagePreviews.value.push(previewUrl);

    selectedImage.value = null;

};


const removeImage = (index) => {

    URL.revokeObjectURL(
        imagePreviews.value[index]
    );


    form.images.splice(index, 1);


    imagePreviews.value.splice(index, 1);

};



const clearImagePreviews = () => {



    imagePreviews.value.forEach((url) => {

        URL.revokeObjectURL(url);

    });


    imagePreviews.value = [];

    selectedImage.value = null;

};


watch(
    () => props.book,

    (book) => {

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

            clearImagePreviews();

            return;
        }

        Object.assign(form, {

            name: book.name ?? "",

            author: book.author ?? "",

            description: book.description ?? "",

            listPrice: book.listPrice ?? null,

            sellPrice: book.sellPrice ?? null,

            quantity: book.quantity ?? null,

            discountPercent: book.discountPercent ?? null,
            status: book.status ?? "ACTIVE",

            // Hỗ trợ cả mảng chuỗi (từ Table) và mảng Object {id, name} (từ Chi tiết)
            genreIds: book.genreIds || (book.genres ? book.genres.map(g => {
                if (typeof g === 'object' && g.id) return g.id; // Nếu là cục data detail có {id: 2, name: ...}
                const found = props.genres.find(x => x.name === g); // Nếu là mảng chuỗi
                return found ? found.id : null;
            }).filter(id => id !== null) : []),


            images: []

        });

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