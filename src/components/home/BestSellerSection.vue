<template>
    <section class="mb-10">

        <div class="d-flex justify-space-between align-center ">

            <h2>Sách bán chạy</h2>

            <router-link to="auth/login">
                <v-btn variant="tonal">
                    <b>Xem tất cả</b>
                    <v-icon icon="mdi-arrow-right" class="ml-2"></v-icon>
                </v-btn>
            </router-link>

        </div>

        <v-row>

            <v-col v-for="book in books" :key="book.id" cols="12" sm="6" md="3" lg="3">
                <BookCard :book="book" />
            </v-col>

        </v-row>

    </section>
</template>

<script setup>
import BookCard from '../common/BookCard.vue';



const books = [
    {
        id: 1,
        title: 'Đắc Nhân Tâm',
        price: 120000,
        image: 'https://picsum.photos/200/300?1'
    },
    {
        id: 2,
        title: 'Tuổi trẻ đáng giá',
        price: 99000,
        image: 'https://picsum.photos/200/300?2'
    },
    {
        id: 3,
        title: 'Atomic Habits',
        price: 189000,
        image: 'https://picsum.photos/200/300?3'
    },
    {
        id: 4,
        title: 'Clean Code',
        price: 210000,
        image: 'https://picsum.photos/200/300?4'
    },
]
</script>