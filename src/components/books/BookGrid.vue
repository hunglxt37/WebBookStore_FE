<template>
    <v-row>
        <!-- Loading -->
        <template v-if="loading">
            <v-col v-for="i in 12" :key="i" cols="12" sm="6" md="3" lg="3" xl="3">
                <v-skeleton-loader type="article" />
            </v-col>
        </template>

        <!-- Danh sách sách: 4 cuốn / 1 dòng trên màn hình desktop (md="3" lg="3") -->
        <template v-else-if="books.length">
            <v-col v-for="book in books" :key="book.id" cols="12" sm="6" md="3" lg="3" xl="3" class="d-flex">
                <BookCard :book="book" class="w-100" />
            </v-col>
        </template>

        <template v-else>
            <v-col cols="12">
                <v-alert type="info" variant="tonal">
                    Không tìm thấy sách.
                </v-alert>
            </v-col>
        </template>

    </v-row>
</template>

<script setup>
import BookCard from "./BookCard.vue";

defineProps({

    books: {
        type: Array,
        default: () => [],
    },

    loading: {
        type: Boolean,
        default: false,
    },

});
</script>

<style scoped></style>