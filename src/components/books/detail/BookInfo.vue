<template>
    <v-card class="pa-4 rounded-lg" elevation="1">
        <h2 class="ma-0">{{ book.name }}</h2>

        <v-row>
            <v-col cols="12" md="6">
                <p>Tác giả: <b>{{ book.author }}</b></p>

            </v-col>
            <v-col cols="12" md="6">
                <div class="mt-3">
                    <v-chip v-for="genre in book.genres" :key="genre.id" size="small" color="primary" variant="tonal"
                        class="me-1">
                        {{ genre.name }}
                    </v-chip>
                </div>
            </v-col>
        </v-row>

        <div class="w-60 d-flex align-center ga-3">
            <v-rating :model-value="book.avgRating" readonly half-increments active-color="warning" density="compact" />
            <p>|</p>
            <p class="pt-1">Đã bán: {{ book.soldQuantity }} </p>
        </div>


        <div class="w-60 d-flex align-center ga-3">

            <!-- Giá bán -->
            <p class="text-red text-h1 font-weight-bold sell-price">
                {{ formatPrice(book.sellPrice) }} đ
            </p>

            <!-- Giá gốc -->
            <span v-if="book.listPrice > book.sellPrice"
                class="text-body-1 text-grey text-decoration-line-through mb-2">
                {{ formatPrice(book.listPrice) }} đ
            </span>

            <!-- % giảm -->
            <v-chip v-if="discountPercent(book.listPrice, book.sellPrice) > 0" size="small" color="red-darken-2"
                variant="flat" rounded="md" class="font-weight-bold mb-2 ma-0">
                -{{ discountPercent(book.listPrice, book.sellPrice) }}%
            </v-chip>

        </div>

        <p class="text-red ma-0">Chính sách khuyến mãi trên chỉ áp dụng tại Lumina Book !</p>


        <v-divider />

        <!-- <div>
            <p class="mb-2">Số lượng:</p>

            <div class=" d-flex align-center" style="width: 150px">

                <v-btn icon="mdi-minus" variant="outlined" size="small" rounded="0" @click="decrease" />

                <v-text-field v-model.number="quantity" type="number" variant="outlined" density="compact" hide-details
                    single-line class="quantity-input" />

                <v-btn icon="mdi-plus" variant="outlined" size="small" rounded="0" @click="increase" />
            </div>
        </div> -->

        <v-row class="mt-2">
            <v-col cols="6">
                <app-button class="font-weight-bold w-100" prepend-icon="mdi-cart" variant="outlined" color="warning"
                    text="THÊM VÀO GIỎ" />
            </v-col>

            <v-col cols="6">
                <app-button class="font-weight-bold text-red w-100" variant="tonal" text="MUA NGAY" />
            </v-col>
        </v-row>

    </v-card>
</template>
<script setup>
import AppButton from '@/components/common/AppButton.vue';


defineProps({
    book: {
        type: Object,
        required: true,
    },
})

const discountPercent = (listPrice, sellPrice) => {
    if (!listPrice || listPrice <= sellPrice) {
        return 0;
    }

    return Math.round(((listPrice - sellPrice) / listPrice) * 100);
};

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price)
</script>
<style scoped>
.sell-price {
    font-size: 30px !important;
    font-weight: 700 !important;
    margin: 0;
}
</style>