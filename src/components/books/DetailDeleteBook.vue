<template>
  <v-dialog v-model="dialogModel" max-width="720" scrollable>
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">
          {{ isDetail ? 'Xem chi tiết sách' : 'Xóa sách' }}
        </span>
        <v-btn icon="mdi-close" variant="text" aria-label="Đóng" @click="close" />
      </v-card-title>

      <v-divider />

      <v-card-text v-if="book && isDetail" class="pa-6">
        <v-row>
          <v-col cols="12" sm="4">
            <v-img
              :src="book.thumbnailUrl || book.images?.[0]?.urlImage"
              :alt="book.name"
              height="240"
              cover
              class="rounded-lg bg-grey-lighten-2"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon size="56" color="grey">mdi-book-open-page-variant</v-icon>
                </div>
              </template>
            </v-img>
          </v-col>

          <v-col cols="12" sm="8">
            <div class="text-h6 font-weight-bold mb-1">{{ book.name }}</div>
            <div class="text-body-1 text-medium-emphasis mb-4">{{ book.author }}</div>

            <div class="detail-row"><span>Giá niêm yết</span><strong>{{ formatPrice(book.listPrice) }}</strong></div>
            <div class="detail-row"><span>Giá bán</span><strong class="text-error">{{ formatPrice(book.sellPrice) }}</strong></div>
            <div class="detail-row"><span>Số lượng</span><strong>{{ book.quantity ?? '-' }}</strong></div>
            <div v-if="book.discountPercent != null" class="detail-row"><span>Giảm giá</span><strong>{{ book.discountPercent }}%</strong></div>

            <div v-if="book.genres?.length" class="mt-4">
              <div class="text-body-2 text-medium-emphasis mb-2">Thể loại</div>
              <v-chip v-for="genre in book.genres" :key="genre.id || genre" class="me-2 mb-2" size="small" color="primary">
                {{ genre.name || genre }}
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <div v-if="book.description" class="mt-5">
          <div class="text-subtitle-2 mb-1">Mô tả</div>
          <div class="text-body-2 description">{{ book.description }}</div>
        </div>
      </v-card-text>

      <v-card-text v-else-if="book" class="pa-6">
        <div class="d-flex ga-4 align-center">
          <v-avatar color="error" variant="tonal" size="48"><v-icon>mdi-alert</v-icon></v-avatar>
          <div>
            <div class="text-body-1">Bạn có chắc chắn muốn xóa sách <strong>“{{ book.name }}”</strong>?</div>
            <div class="text-body-2 text-medium-emphasis mt-1">Thao tác này không thể hoàn tác.</div>
          </div>
        </div>
      </v-card-text>

      <v-card-text v-else class="pa-6 text-medium-emphasis">Không có thông tin sách.</v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn v-if="isDetail" variant="outlined" @click="close">Đóng</v-btn>
        <template v-else>
          <v-btn variant="outlined" @click="close">Hủy</v-btn>
          <v-btn color="error" variant="flat" :disabled="!book" @click="confirmDelete">Xóa</v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'detail' },
  book: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'delete'])

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isDetail = computed(() => props.mode === 'detail')

const close = () => {
  dialogModel.value = false
}

const confirmDelete = () => {
  emit('delete', props.book)
}

const formatPrice = (price) => price == null ? '-' : `${Number(price).toLocaleString('vi-VN')} ₫`
</script>

<style scoped>
.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 7px 0;
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
}

.description { white-space: pre-line; }
</style>
