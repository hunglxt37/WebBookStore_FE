<template>
  <v-container class="py-6 checkout-view">
    <!-- Header -->
    <div class="d-flex align-center mb-5">
      <v-btn icon="mdi-arrow-left" variant="text" aria-label="Quay lại giỏ hàng" @click="router.push('/carts')" />
      <h1 class="text-h5 font-weight-bold ms-2">THANH TOÁN</h1>
    </div>

    <!-- Cảnh báo chưa chọn sản phẩm -->
    <v-alert v-if="!cartStore.selectedItems.length" type="warning" variant="tonal" class="mb-4">
      Bạn chưa chọn sản phẩm nào. Vui lòng quay lại giỏ hàng để chọn sản phẩm cần mua.
    </v-alert>

    <v-form @submit.prevent="placeOrder">
      <v-row>
        <!-- CỘT TRÁI: Form nhập thông tin -->
        <v-col cols="12" md="8">
          <!-- 1. Thông tin người nhận -->
          <v-card class="pa-5 mb-4" rounded="lg" elevation="1">
            <h2 class="text-h6 font-weight-bold mb-4">1. Thông tin người nhận</h2>

            <v-row>
              <v-col cols="12" sm="6">
                <AppInput v-model.trim="fullName" label="Họ và tên" type="text" :error-message="errors.fullName"
                  :field-props="fullNameProps" />
              </v-col>
              <v-col cols="12" sm="6">
                <AppInput v-model.trim="phone" label="Số điện thoại" type="text" :error-message="errors.phone"
                  :field-props="phoneProps" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model.trim="deliveryAddress" label="Địa chỉ giao hàng" v-bind="deliveryAddressProps"
                  :error-messages="errors.deliveryAddress" variant="outlined" density="comfortable" rows="2" />
              </v-col>
            </v-row>

          </v-card>

          <!-- 2. Hình thức giao hàng -->
          <v-card class="pa-5 mb-4" rounded="lg" elevation="1">
            <h2 class="text-h6 font-weight-bold mb-3">2. Hình thức giao hàng</h2>

            <v-radio-group v-model="deliveryId" v-bind="deliveryIdProps" :error-messages="errors.deliveryId"
              hide-details="auto">

              <v-card v-for="delivery in deliveries" :key="delivery.id" variant="outlined" class="mb-2">
                <v-radio :value="delivery.id" class="px-3 py-2">
                  <template #label>
                    <div class="w-100 d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-medium">{{ delivery.name }}</div>
                        <div v-if="delivery.description" class="text-body-2 text-medium-emphasis">
                          {{ delivery.description }}
                        </div>
                      </div>
                      <span class="text-primary font-weight-bold">{{ formatPrice(delivery.feeDelivery) }} đ</span>
                    </div>
                  </template>
                </v-radio>
              </v-card>
            </v-radio-group>
            <div v-if="!deliveries.length && !loadingOptions" class="text-medium-emphasis">
              Chưa có hình thức giao hàng.
            </div>
          </v-card>

          <!-- 3. Phương thức thanh toán -->
          <v-card class="pa-5 mb-4" rounded="lg" elevation="1">
            <h2 class="text-h6 font-weight-bold mb-3">3. Phương thức thanh toán</h2>
            <v-radio-group v-model="paymentId" v-bind="paymentIdProps" :error-messages="errors.paymentId"
              hide-details="auto">
              <v-card v-for="payment in payments" :key="payment.id" variant="outlined" class="mb-2">
                <v-radio :value="payment.id" class="px-3 py-2">
                  <template #label>
                    <div class="w-100 d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-medium">{{ payment.name }}</div>
                        <div v-if="payment.description" class="text-body-2 text-medium-emphasis">
                          {{ payment.description }}
                        </div>
                      </div>
                      <span class="text-primary font-weight-bold">{{ formatPrice(payment.feePayment) }} đ</span>
                    </div>
                  </template>
                </v-radio>
              </v-card>
            </v-radio-group>
            <div v-if="!payments.length && !loadingOptions" class="text-medium-emphasis">
              Chưa có phương thức thanh toán.
            </div>
          </v-card>

          <!-- 4. Ghi chú đơn hàng -->
          <v-card class="pa-5" rounded="lg" elevation="1">
            <h2 class="text-h6 font-weight-bold mb-3">4. Ghi chú đơn hàng</h2>
            <v-textarea v-model.trim="note" v-bind="noteProps" :error-messages="errors.note"
              label="Ghi chú cho người bán (không bắt buộc)" variant="outlined" density="comfortable" rows="3"
              auto-grow />
          </v-card>
        </v-col>

        <!-- CỘT PHẢI: Tóm tắt đơn hàng -->
        <v-col cols="12" md="4">
          <v-card class="pa-5 summary-card" rounded="lg" elevation="2">
            <h2 class="text-h6 font-weight-bold mb-4">5. Tóm tắt đơn hàng</h2>

            <!-- Danh sách sản phẩm -->
            <div v-for="item in cartStore.selectedItems" :key="item.id" class="d-flex mb-4">
              <v-img :src="item.bookImage" width="52" height="72" max-width="52" cover class="rounded me-3" />
              <div class="flex-grow-1 overflow-hidden">
                <div class="text-body-2 font-weight-medium text-truncate">{{ item.bookName }}</div>
                <div class="text-body-2 text-medium-emphasis mt-1">
                  {{ item.quantity }} x {{ formatPrice(item.sellPrice) }} đ
                </div>
                <div class="text-red font-weight-bold mt-1">
                  {{ formatPrice(item.subTotal ?? item.sellPrice * item.quantity) }} đ
                </div>
              </div>
            </div>

            <v-divider class="mb-4" />

            <!-- Tính toán chi phí -->
            <div class="d-flex justify-space-between mb-2">
              <span>Tiền hàng</span>
              <span>{{ formatPrice(cartStore.selectedTotalAmount) }} đ</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Phí giao hàng</span>
              <span>{{ formatPrice(selectedDelivery?.feeDelivery) }} đ</span>
            </div>
            <div class="d-flex justify-space-between mb-4">
              <span>Phí thanh toán</span>
              <span>{{ formatPrice(selectedPayment?.feePayment) }} đ</span>
            </div>

            <v-divider />

            <div class="d-flex justify-space-between align-center my-4">
              <span class="font-weight-bold">Tổng cộng</span>
              <span class="text-red text-h6 font-weight-bold">{{ formatPrice(totalAmount) }} đ</span>
            </div>

            <v-btn type="submit" block size="large" color="red" class="font-weight-bold" :loading="submitting"
              :disabled="submitting || !cartStore.selectedItems.length || !deliveries.length || !payments.length">
              ĐẶT HÀNG
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/utils/api'
import userService from '@/services/user.service'
import { useCartStore } from '@/stores/cart.store'
import { useOrderStore } from '@/stores/order.store'
import { checkoutSchema } from '@/schemas/checkout.schema'
import AppInput from '@/components/common/AppInput.vue'

const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const deliveries = ref([])
const payments = ref([])
const loadingOptions = ref(false)
const submitting = ref(false)

// 1. Khởi tạo useForm
const { defineField, errors, handleSubmit, setValues } = useForm({
  validationSchema: checkoutSchema,
  initialValues: { fullName: '', phone: '', deliveryAddress: '', note: '', deliveryId: null, paymentId: null },
})

// 2. Bóc tách các field
const [fullName, fullNameProps] = defineField('fullName')
const [phone, phoneProps] = defineField('phone')
const [deliveryAddress, deliveryAddressProps] = defineField('deliveryAddress')
const [note, noteProps] = defineField('note')
const [deliveryId, deliveryIdProps] = defineField('deliveryId')
const [paymentId, paymentIdProps] = defineField('paymentId')

// 3. Computed
const selectedDelivery = computed(() => deliveries.value.find((item) => item.id === deliveryId.value))
const selectedPayment = computed(() => payments.value.find((item) => item.id === paymentId.value))
const totalAmount = computed(() => Number(cartStore.selectedTotalAmount || 0) + Number(selectedDelivery.value?.feeDelivery || 0) + Number(selectedPayment.value?.feePayment || 0))

// 4. Fetch data khi mount
onMounted(async () => {
  if (!cartStore.items.length) await cartStore.fetchCart()
  if (!cartStore.selectedItems.length) return
  loadingOptions.value = true
  try {
    const [profileResponse, deliveriesResponse, paymentsResponse] = await Promise.all([
      userService.getProfile(),
      api.get('/deliveries'),
      api.get('/payments')
    ])
    const profile = profileResponse.data || profileResponse
    setValues({
      fullName: profile.fullName || profile.name || '',
      phone: profile.phone || '',
      deliveryAddress: profile.shippingAddress || profile.billingAddress || ''
    })
    deliveries.value = deliveriesResponse.data?.data || []
    payments.value = paymentsResponse.data?.data || []
    deliveryId.value = deliveries.value[0]?.id ?? null
    paymentId.value = payments.value[0]?.id ?? null
  } catch (error) {
    toast.error(error.response?.data?.message || 'Không thể tải thông tin thanh toán. Vui lòng thử lại.')
  } finally {
    loadingOptions.value = false
  }
})

// 5. Hàm đặt hàng
const placeOrder = handleSubmit(async (values) => {
  if (!cartStore.selectedItems.length) return toast.warning('Vui lòng chọn ít nhất một sản phẩm.')
  submitting.value = true
  try {
    await orderStore.createOrder({
      fullName: values.fullName,
      phone: values.phone,
      deliveryAddress: values.deliveryAddress,
      note: values.note,
      paymentId: values.paymentId,
      deliveryId: values.deliveryId,
      cartItemIds: cartStore.selectedItems.map((item) => item.id)
    })
    await cartStore.fetchCart()
    toast.success('Đặt hàng thành công!')
    router.push('/order-history')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.')
  } finally {
    submitting.value = false
  }
})

// Helper format giá tiền
const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(Number(price) || 0)
</script>

<style scoped>
.summary-card {
  position: sticky;
  top: 24px;
}
</style>
