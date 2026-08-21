<template>
    <v-btn color="primary" size="large" variant="flat" v-bind="$attrs">
        {{ text }}
    </v-btn>
</template>
<script setup>
defineProps({
    text: String,
    default:"Submit"
})
</script>
<style></style>