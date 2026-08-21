<template>
    <div>
        <FormLogin />
    </div>
</template>
<script setup>
import FormLogin from '@/components/auth/FormLogin.vue';
import { useHead } from "@unhead/vue";
useHead({
    title: "Đăng nhập - Lumina Books",
    meta: [
        {
            name: 'description',
            content: 'Đăng Nhập để mua sách'
        },
        //og : cho vào main.html
        {
            property: 'og:title',
            content: 'Đăng nhập - Bookstore'
        },
        {
            property: 'og:description',
            content: 'Đăng Nhập để mua sách'
        },
    ],
});
//useSeoMeta()

</script>
<style></style>