<template>
    <v-card class="book-card" rounded="lg" elevation="2">
        <!-- Ảnh -->
        <v-img :src="book.image" height="260" cover />

        <!-- Nội dung -->
        <v-card-text>

            <!-- Thể loại -->
            <div class="category">
                {{ book.category }}
            </div>

            <!-- Tên sách -->
            <div class="title">
                {{ book.title }}
            </div>

            <!-- Tác giả -->
            <div class="author">
                {{ book.author }}
            </div>

            <!-- Đánh giá -->
            <div class="rating">

                <v-rating :model-value="book.rating" density="compact" color="amber" readonly half-increments
                    size="16" />

                <span class="review">
                    ({{ book.review }})
                </span>

            </div>

            <!-- Giá -->
            <div class="price">
                {{ formatPrice(book.price) }}
            </div>

        </v-card-text>

        <!-- Action -->
        <v-card-actions>

            <v-spacer />

            <v-btn color="primary" icon @click="addToCart">
                <v-icon>
                    mdi-cart-outline
                </v-icon>
            </v-btn>

        </v-card-actions>

    </v-card>
</template>

<script setup>

const props = defineProps({
    book: {
        type: Object,
        required: true
    }
})

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
}

const addToCart = () => {
    console.log(props.book.title)
}

</script>

<style scoped>
.book-card {

    transition: .3s;
    cursor: pointer;
}

.book-card:hover {

    transform: translateY(-6px);

    box-shadow: 0 10px 25px rgba(0, 0, 0, .15);
}

.category {

    color: #888;

    font-size: 13px;
}

.title {

    font-size: 16px;

    font-weight: 600;

    margin-top: 8px;

    height: 48px;
}

.author {

    color: #666;

    font-size: 14px;

    margin-top: 6px;
}

.rating {

    display: flex;

    align-items: center;

    margin-top: 8px;
}

.review {

    margin-left: 6px;

    font-size: 13px;

    color: #777;
}

.price {

    color: #E65100;

    font-size: 20px;

    font-weight: bold;

    margin-top: 10px;
}
</style>