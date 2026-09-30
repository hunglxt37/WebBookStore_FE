<template>
    <v-container class="py-6">

        <div class="mb-4">
            <h2 class="text-h5 font-weight-bold">
                GIỎ HÀNG
                <span class="text-body-1 font-weight-regular">
                    ({{ cartStore.totalQuantity }} sản phẩm)
                </span>
            </h2>
        </div>

        <v-row>
            <!-- ================= LEFT ================= -->
            <v-col cols="12" md="8">
                <!-- Header của danh sách -->
                <v-card class="pa-3 mb-3 rounded-lg" elevation="1">
                    <v-row class="align-center text-body-2 font-weight-medium">
                        <v-col cols="12" md="6">
                            <v-checkbox v-model="selectAll" label="Chọn tất cả" hide-details density="compact" />
                        </v-col>
                        <v-col cols="6" md="3" class="text-center">Số lượng</v-col>
                        <v-col cols="6" md="3" class="text-center">Thành tiền</v-col>
                    </v-row>
                </v-card>

                <!-- cart rỗng -->
                <v-card v-if="cartStore.items.length == 0" class="pa-10 text-center" elevation="1">
                    <v-icon icon="mdi-cart-outline" size="70" color="grey" />
                    <div class="text-h6 mt-4">Giỏ hàng đang trống</div>
                    <div class="text-body-2 text-grey mt-2">Hãy thêm sản phẩm vào giỏ hàng</div>
                </v-card>

                <!-- Danh sách sản phẩm -->
                <v-card v-else v-for="item in cartStore.items" :key="item.id" class="pa-4 mb-3 rounded-lg"
                    elevation="1">
                    <v-row class="align-center">
                        <v-col cols="12" md="6">
                            <div class="d-flex align-center">
                                <v-checkbox v-model="cartStore.selectedItemIds" :value="item.id" hide-details
                                    density="compact" class="me-2" />
                                <v-img :src="item.bookImage" width="100" height="130" max-width="100" cover
                                    class="rounded me-4" />
                                <div>
                                    <div class="text-body-1 font-weight-medium">
                                        {{ item.bookName }}
                                    </div>
                                    <!-- BE chưa có tac giả -->
                                    <!-- <div class="text-body-2 text-grey-darken-1 mt-1">
                                        Tác giả:
                                        {{ item.author }}
                                    </div> -->
                                    <div class="mt-2 d-flex align-center ga-2">
                                        <span class="text-red font-weight-bold">
                                            Giá: {{ formatPrice(item.sellPrice) }} đ
                                        </span>
                                        <span v-if="item.listPrice && item.listPrice > item.sellPrice" class="text-caption text-grey text-decoration-line-through">
                                            {{ formatPrice(item.listPrice) }} đ
                                        </span>
                                    </div>
                                    <div v-if="item.stockQuantity !== undefined" class="text-caption text-grey mt-1">
                                        Còn lại: {{ item.stockQuantity }} cuốn trong kho
                                    </div>
                                </div>
                            </div>
                        </v-col>

                        <!-- Quantity -->
                        <v-col cols="6" md="3" class="d-flex justify-center">

                            <div class="quantity-control">

                                <v-btn icon="mdi-minus" variant="outlined" size="small" rounded="0"
                                    @click="decrease(item)" />

                                <v-text-field v-model.number="item.quantity" type="number" min="1" variant="outlined"
                                    density="compact" hide-details single-line class="quantity-input" />

                                <v-btn icon="mdi-plus" variant="outlined" size="small" rounded="0"
                                    :disabled="item.stockQuantity !== undefined && item.quantity >= item.stockQuantity"
                                    @click="increase(item)" />

                            </div>

                        </v-col>


                        <!-- Total + delete -->
                        <v-col cols="6" md="3" class="d-flex align-center justify-center ga-2">

                            <div class="text-red font-weight-bold">
                                {{ formatPrice(item.sellPrice * item.quantity) }} đ
                            </div>

                            <v-btn icon="mdi-delete-outline" variant="outlined" color="grey" size="small" 
                                @click="removeItem(item.id)" />

                        </v-col>

                    </v-row>

                </v-card>

            </v-col>


            <!-- ================= RIGHT ================= -->
            <v-col cols="12" md="4">

                <!-- Promotion -->
                <v-card class="pa-4 rounded-lg mb-3" elevation="1">

                    <div class="d-flex justify-space-between align-center">
                        <div class="d-flex align-center">

                            <v-icon icon="mdi-ticket-percent-outline" color="primary" class="me-2" />

                            <span class="font-weight-medium">
                                KHUYẾN MÃI
                            </span>

                        </div>

                        <v-btn variant="text" color="primary" size="small">
                            Xem thêm
                            <v-icon icon="mdi-chevron-right" />
                        </v-btn>
                    </div>

                    <v-divider class="my-3" />

                    <v-card variant="outlined" class="pa-3">
                        <div class="d-flex align-center">

                            <v-icon icon="mdi-ticket-confirmation-outline" size="40" color="grey" class="me-3" />

                            <div>
                                <div class="font-weight-medium">
                                    GIẢM NGAY 400K
                                </div>

                                <div class="text-body-2 text-grey">
                                    Nhập mã: ZLPFHSH
                                </div>

                                <div class="text-body-2 text-grey">
                                    Giảm 400K cho đơn hàng
                                </div>
                            </div>

                        </div>
                    </v-card>

                    <v-btn block variant="tonal" color="primary" class="mt-3">
                        1 khuyến mãi đủ điều kiện
                    </v-btn>

                </v-card>


                <!-- Gift -->
                <v-card class="pa-4 mb-3 rounded-lg" elevation="1">

                    <div class="d-flex align-center">

                        <v-icon icon="mdi-gift-outline" color="red" class="me-3" />

                        <span class="font-weight-bold">
                            Nhận quà
                        </span>

                        <v-spacer />

                        <v-btn variant="text" color="primary" size="small">
                            Chọn quà
                            <v-icon icon="mdi-chevron-right" />
                        </v-btn>

                    </div>

                </v-card>


                <!-- Free shipping -->
                <v-card class="pa-3 mb-3 rounded-lg" variant="outlined" color="green">

                    <div class="d-flex align-center">

                        <v-icon icon="mdi-truck-fast-outline" color="green" class="me-2" />

                        <span>
                            <b>Miễn phí giao hàng</b>
                            cho đơn từ
                            <b>500k</b> trở lên!
                        </span>

                    </div>

                </v-card>


                <!-- Summary -->
                <v-card class="pa-4 rounded-lg" elevation="1">

                    <div class="d-flex justify-space-between mb-3">
                        <span>Thành tiền</span>
                        <span>{{ formatPrice(cartStore.selectedTotalAmount) }} đ</span>
                    </div>
                    <v-divider />

                    <div class="d-flex justify-space-between align-center my-4">
                        <span class="font-weight-bold">Tổng số tiền</span>
                        <span class="text-red text-h6 font-weight-bold">{{ formatPrice(cartStore.selectedTotalAmount) }} đ</span>
                    </div>

                    <v-btn block size="large" color="red" class="font-weight-bold"
                        :disabled="cartStore.selectedItems.length === 0" @click="checkout">
                        THANH TOÁN
                    </v-btn>

                </v-card>

            </v-col>

        </v-row>

    </v-container>
</template>


<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'

const router = useRouter()
const cartStore = useCartStore()

onMounted(async () => {
    await cartStore.fetchCart()
})

//Chọn tất cả
const selectAll = computed({
    get() {
        return (
            cartStore.items.length > 0 &&
            cartStore.selectedItemIds.length ===
            cartStore.items.length
        )
    },

    set(value) {
        if (value) {
            cartStore.selectedItemIds =
                cartStore.items.map(item => item.id)
        } else {
            cartStore.selectedItemIds = []
        }
    }
})


const increase = async (item) => {
    await cartStore.updateQuantity(
        item.id,
        item.quantity + 1
    )
}

const decrease = async (item) => {

    if (item.quantity <= 1) {
        return
    }

    await cartStore.updateQuantity(
        item.id,
        item.quantity - 1
    )
}


const removeItem = async (cartItemId) => {
    await cartStore.removeFromCart(cartItemId)
}


const checkout = () => {

    if (cartStore.selectedItems.length === 0) {
        return
    }

    router.push('/checkout')
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0)
}
</script>


<style scoped>
.quantity-control {
    display: flex;
    align-items: center;
    width: 140px;
}

.quantity-input {
    width: 55px;
}
</style>