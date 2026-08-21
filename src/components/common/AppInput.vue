<template>
    <v-text-field v-model="modelValue" v-bind="$attrs"></v-text-field>
</template>
<script setup>
defineOptions({
    inheritAttrs: false,
})

const modelValue = defineModel()

</script>
<style></style>