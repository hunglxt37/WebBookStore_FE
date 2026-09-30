<template>
    <v-card class="book-card rounded-lg" elevation="2" hover>
        <v-img :src="book.thumbnailUrl" height="220" cover class="position-relative">
            <template #error>
                <v-img src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png" height="220" cover />
            </template>
            <v-chip v-if="book.discountPercent && book.discountPercent > 0"
                color="red"
                size="x-small"
                class="position-absolute font-weight-bold ma-2"
                style="top: 0; left: 0; z-index: 2;">
                -{{ book.discountPercent }}%
            </v-chip>
        </v-img>

        <v-card-text class="pa-4">

            <h3 class="text-no-wrap text-truncate" :title="book.name">{{ book.name }}</h3>
            <div class="book-author text-caption text-grey">{{ book.author }}</div>

            <div class="d-flex justify-space-between align-center mt-2">
                <div>
                    <div class="text-red font-weight-bold text-subtitle-1">
                        {{ formatPrice(book.sellPrice) }} đ
                    </div>
                    <div v-if="book.listPrice && book.listPrice > book.sellPrice" class="text-caption text-grey text-decoration-line-through">
                        {{ formatPrice(book.listPrice) }} đ
                    </div>
                </div>

                <div class="d-flex align-center">
                    <v-rating :model-value="book.avgRating" readonly density="compact" half-increments color="warning"
                        size="16" />
                    <span class="text-grey ms-1 text-caption">
                        ({{ book.avgRating }})
                    </span>
                </div>
            </div>

            <div class="mt-3">
                <v-chip v-for="genre in book.genres" :key="genre" size="small" color="primary" variant="tonal"
                    class="me-1">
                    {{ genre }}
                </v-chip>
            </div>

        </v-card-text>

        <v-divider />

        <!-- Action -->
        <v-card-actions class="px-4 pb-4">

            <v-btn block color="primary" prepend-icon="mdi-eye" :to="`/books/${book.id}`">
                Xem chi tiết
            </v-btn>

        </v-card-actions>
    </v-card>
</template>

<script setup>
defineProps({
    book: {
        type: Object,
        required: true,
    },
})

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price)

</script>

<style scoped></style>