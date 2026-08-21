<template>
    <v-container>
        <v-row>
            
            <v-col cols="12" md="5">
                <book-image v-if="bookStore.book" :images="bookStore.book.images" />
            </v-col>

            <v-col cols="12" md="7">
                <book-info v-if="bookStore.book" :book="bookStore.book" />
            </v-col>

        </v-row>
    </v-container>
</template>
<script setup>
import BookImage from '@/components/books/detail/BookImage.vue';
import BookInfo from '@/components/books/detail/BookInfo.vue';
import { useBookStore } from '@/stores/book.store';
import { onMounted } from 'vue';
import { useRoute } from "vue-router";

const route = useRoute();
const bookStore = useBookStore();

onMounted(async () => {

    const id = route.params.id;

    console.log("ID:", id);
    await bookStore.fetchBookById(id);
});

</script>
<style></style>
