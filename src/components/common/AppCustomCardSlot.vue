<template>
    <v-card rounded="lg" elevation="1">

        <!-- 1. Header: Chỉ hiện khi CHA có truyền slot "header" -->
        <template v-if="$slots.header">
            <v-card-title class="pa-4">
                <slot name="header" />
            </v-card-title>
            <v-divider />
        </template>

        <!-- 2. Body: Nơi chứa bảng v-table hoặc v-data-table -->
        <v-card-text class="pa-0">
            <slot name="body" />
        </v-card-text>

        <!-- 3. Footer: Chỉ hiện khi CHA có truyền slot "footer" -->
        <template v-if="$slots.footer">
            <v-divider />
            <v-card-actions class="pa-4">
                <slot name="footer" />
            </v-card-actions>
        </template>

    </v-card>
</template>

<script setup>
</script>