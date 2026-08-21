<template>
  <v-card class="pa-3" rounded="lg" elevation="1">
    <v-img
      :src="selectedImage?.urlImage"
      :alt="selectedImage ? `Ảnh sách ${selectedImage.id}` : 'Chưa có ảnh sách'"
      height="430"
      cover
      class="rounded-lg bg-grey-lighten-2 main-image"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </template>

      <template #error>
        <div class="d-flex flex-column align-center justify-center fill-height text-grey">
          <v-icon size="64">mdi-image-off-outline</v-icon>
          <span class="mt-2">Không thể tải ảnh</span>
        </div>
      </template>
    </v-img>

    <div v-if="imageList.length > 1" class="d-flex ga-2 mt-3 thumbnail-list">
      <button
        v-for="image in imageList"
        :key="image.id"
        type="button"
        class="thumbnail"
        :class="{ selected: image.id === selectedImage?.id }"
        :aria-label="`Xem ảnh ${image.id}`"
        @click="selectedImage = image"
      >
        <v-img :src="image.urlImage" height="74" cover class="rounded" />
      </button>
    </div>
  </v-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
})

const imageList = computed(() => props.images.filter((image) => image?.urlImage))
const selectedImage = ref(null)

// Khi chuyển sang một sách khác, ưu tiên ảnh có icon: true làm ảnh chính.
watch(
  imageList,
  (images) => {
    selectedImage.value = images.find((image) => image.icon === true) || images[0] || null
  },
  { immediate: true },
)
</script>

<style scoped>
.main-image { width: 100%; }

.thumbnail-list {
  overflow-x: auto;
  padding-bottom: 2px;
}

.thumbnail {
  flex: 0 0 76px;
  height: 78px;
  padding: 2px;
  border: 2px solid transparent;
  border-radius: 7px;
  cursor: pointer;
  background: transparent;
}

.thumbnail.selected {
  border-color: rgb(var(--v-theme-primary));
}
</style>
