<template>
  <v-text-field
    v-model.trim="modelValue"
    :label="label"
    :type="type"
    :error-messages="errorMessage"
    v-bind="fieldProps"
    variant="outlined"
    density="comfortable"
  />
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  type: { type: String, default: "text" },
  errorMessage: { type: String, default: "" },
  fieldProps: { type: Object, default: () => ({}) }, // Nhận object chứa sự kiện onBlur, onChange từ defineField
});
const modelValue = defineModel();
</script>
