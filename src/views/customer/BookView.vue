<template>
    <div class="ma-10">
        <v-row>
            <v-col cols="12" md="3">
                <!-- Truyền hàm changeFilter của store thẳng vào sự kiện @filter -->
                <BookFilter @filter="bookStore.changeFilter" @reset="bookStore.reset" />
            </v-col>


            <v-col cols="12" md="9">
                <BookToolbar 
                :sort-by="bookStore.sortBy" 
                :size="bookStore.size" 
                @change-sort="bookStore.changeSort"
                @change-size="bookStore.changeSize" />

                <BookGrid :books="bookStore.books" :loading="bookStore.loading" />

                <BookPagination v-if="bookStore.totalPages > 1" :page="bookStore.page + 1"
                    :total-pages="bookStore.totalPages" @change-page="bookStore.changePage" />
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import BookGrid from '@/components/books/BookGrid.vue';
import { onMounted } from "vue";
import { useBookStore } from "@/stores/book.store";
import BookToolbar from '@/components/books/BookToolbar.vue';
import BookPagination from '@/components/books/BookPagination.vue';
import BookFilter from '@/components/books/BookFilter.vue';

const bookStore = useBookStore();

onMounted(() => {
    bookStore.fetchBooks();
});
</script>

<style></style>