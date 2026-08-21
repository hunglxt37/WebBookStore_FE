<template>
    <v-card class="book-card rounded-lg" elevation="2" hover>
        <v-img :src="book.thumbnailUrl" height="220" cover>
            <template #error>
                <v-img src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png" height="220" cover />
            </template>
        </v-img>

        <v-card-text class="pa-4">

            <h3 class="text-no-wrap">{{ book.name }}</h3>
            <div class="book-author">{{ book.author }}</div>

            <div class="d-flex justify-space-between align-center">
                <div class="mt-3 text-red font-weight-bold">
                    {{ formatPrice(book.sellPrice) }} đ
                </div>

                <div class="d-flex align-center mt-2">
                    <v-rating :model-value="book.avgRating" readonly density="compact" half-increments color="warning"
                        size="16" />
                    <span class="text-grey ms-2 text-caption">
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