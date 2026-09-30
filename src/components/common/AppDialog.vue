<template>
  <v-dialog
    v-model="model"
    :max-width="maxWidth"
    :scrollable="scrollable"
    persistent-when-loading
  >
    <v-card rounded="lg" elevation="3">
      <!-- Header -->
      <slot name="header">
        <v-card-title
          class="d-flex align-center justify-space-between pa-4 font-weight-bold"
          :class="headerClasses"
        >
          <span class="text-h6 font-weight-bold">
            {{ title }}
          </span>
          <v-btn
            icon="mdi-close"
            variant="text"
            density="compact"
            :disabled="loading"
            @click="close"
          />
        </v-card-title>
      </slot>

      <v-divider v-if="!noDivider" />

      <!-- Body -->
      <v-card-text class="pa-4">
        <slot />
      </v-card-text>

      <v-divider v-if="!noDivider" />

      <!-- Footer / Actions -->
      <slot name="actions">
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            v-if="showCancel"
            variant="tonal"
            color="grey-darken-1"
            :disabled="loading"
            class="text-none"
            @click="close"
          >
            {{ cancelText }}
          </v-btn>
          <v-btn
            v-if="showSubmit"
            :color="submitColor"
            variant="flat"
            :loading="loading"
            :disabled="loading"
            class="text-none font-weight-bold px-5"
            @click="submit"
          >
            {{ submitText }}
          </v-btn>
        </v-card-actions>
      </slot>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const model = defineModel({
  type: Boolean,
  default: false,
});

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: [String, Number],
    default: '600px',
  },
  submitText: {
    type: String,
    default: 'Xác nhận',
  },
  cancelText: {
    type: String,
    default: 'Đóng',
  },
  submitColor: {
    type: String,
    default: 'primary',
  },
  headerBg: {
    type: String,
    default: 'primary', // 'primary', 'surface', 'grey-lighten-4', etc.
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showSubmit: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  scrollable: {
    type: Boolean,
    default: true,
  },
  noDivider: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const headerClasses = computed(() => {
  if (props.headerBg === 'primary') {
    return 'bg-primary text-white';
  }
  if (props.headerBg === 'surface') {
    return 'bg-surface text-grey-darken-4';
  }
  return `bg-${props.headerBg}`;
});

const close = () => {
  if (props.loading) return;
  model.value = false;
  emit('cancel');
};

const submit = () => {
  emit('submit');
};
</script>

<style scoped></style>
