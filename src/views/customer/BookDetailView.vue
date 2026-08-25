<template>
    <v-container>
        <v-row>

            <v-col cols="12" md="5">
                <book-image v-if="bookStore.book" :images="bookStore.book.images" />
            </v-col>

            <v-col cols="12" md="7">
                <book-info v-if="bookStore.book" :book="bookStore.book" @them-gio-hang="handleAddToCart" />
                <!-- @mua-ngay="handleBuyNow" -->
            </v-col>

        </v-row>
    </v-container>
</template>
<script setup>
import BookImage from '@/components/books/detail/BookImage.vue';
import BookInfo from '@/components/books/detail/BookInfo.vue';
import { useBookStore } from '@/stores/book.store';
import { useCartStore } from '@/stores/cart.store'
import { onMounted } from 'vue';
import { useRoute } from "vue-router";

const route = useRoute();
const bookStore = useBookStore();
const cartStore = useCartStore()


onMounted(async () => {

    const id = route.params.id;

    console.log("ID:", id);
    await bookStore.fetchBookById(id);
});


const handleAddToCart = async ({ bookId, quantity }) => {
    await cartStore.addToCart(bookId, quantity)
}

// const handleBuyNow = ({ bookId, quantity }) => {
//     // xử lý mua ngay
// }
</script>
<style></style>
