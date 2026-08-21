<template>
    <v-card class="pa-5 rounded-lg" color="blue-lighten-5">
        <v-card-title class="font-weight-bold">
            Bộ lọc tìm kiếm
        </v-card-title>
        <v-card-text>
            Khám phá theo danh mục
        </v-card-text>

        <v-card class="mb-6">
            <v-card-text class="font-weight-bold">
                Lọc theo thể loại
            </v-card-text>
            <v-btn v-for="genre in genreStore.genres" :key="genre.id" block class="mb-2 justify-start"
                :color="selectedGenre == genre.id ? 'orange' : 'black'"
                :variant="selectedGenre == genre.id ? 'flat' : 'text'" @click="selectedGenre = genre.id">
                {{ genre.name }}
            </v-btn>

        </v-card>

        <!-- Giá -->
        <div class="mb-6">

            <h4 class="font-weight-bold mb-2">
                Giá thành
            </h4>


            <v-checkbox v-model="selectedPrices" value="under100" density="compact" hide-details
                label="Dưới 100.000đ" />


            <v-checkbox v-model="selectedPrices" value="100-300" density="compact" hide-details
                label="100.000đ - 300.000đ" />


            <v-checkbox v-model="selectedPrices" value="over300" density="compact" hide-details label="Trên 300.000đ" />

        </div>

        <!-- Rating -->
        <div class="mb-6">

            <h4 class="font-weight-bold mb-2">
                Đánh giá
            </h4>

            <v-rating v-model="rating" color="amber" density="compact" />

        </div>


        <!-- Button -->
        <div class="d-flex justify-space-between">
            <v-btn color="success" @click="resetFilter">
                Xóa bộ lọc
            </v-btn>
            <v-btn color="primary" @click="applyFilter">
                Áp dụng bộ lọc
            </v-btn>
        </div>


    </v-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useGenreStore } from "@/stores/genre.store";

const genreStore = useGenreStore();

// Danh mục được chọn
const selectedGenre = ref(null);
// Khoảng giá
const selectedPrices = ref([]);
// Rating
const rating = ref(null);

onMounted(() => {
    genreStore.getAllGenre();
});

// Emit
const emit = defineEmits([
    "filter",
    "reset"
]);

const applyFilter = () => {
    let min = null;
    let max = null;

    if (selectedPrices.value.length > 0) {
        const prices = selectedPrices.value;
        const hasUnder100 = prices.includes('under100');
        const has100To300 = prices.includes('100-300');
        const hasOver300 = prices.includes('over300');

        // Tìm minPrice nhỏ nhất
        if (hasUnder100) min = 0;
        else if (has100To300) min = 100000;
        else if (hasOver300) min = 300000;

        // Tìm maxPrice lớn nhất
        if (hasOver300) max = null;
        else if (has100To300) max = 300000;
        else if (hasUnder100) max = 100000;
    }

    emit("filter", {
        genreId: selectedGenre.value,
        minPrice: min,
        maxPrice: max,
        rating: rating.value
    });


};

const resetFilter = () => {
    selectedGenre.value = null;
    selectedPrices.value = [];
    rating.value = 5;

    emit("reset");
};
</script>