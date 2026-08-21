<template>
    <v-row>
        <!-- Loading -->
        <template v-if="loading">
            <v-col v-for="i in 12" :key="i" cols="12" sm="6" md="4" lg="3">
                <v-skeleton-loader type="article" />
            </v-col>
        </template>

        <!-- Danh sách sách -->
        <template v-else-if="books.length">
            <v-col v-for="book in books" :key="book.id" cols="12" sm="6" md="3">
                <BookCard :book="book" />
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