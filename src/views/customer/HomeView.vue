<template>
    <div>
        <BannerSection class="ma-2" />

        <v-container class="pa-03 mt-0">

            <BestSellerSection />

            <!--<NewArrivalSection />

        <CategorySection />

        <BlogSection /> -->

        </v-container>
    </div>
</template>
<script setup>
import BannerSection from '@/components/home/BannerSection.vue';
import BestSellerSection from '@/components/home/BestSellerSection.vue';

//SEO
import { useHead } from "@unhead/vue";
useHead({
    title: "Trang chủ - Lumina Books",
    meta: [
        {
            name: "description",
            content: "Khám phá hàng nghìn đầu sách mới nhất."
        },
        {
            property: "og:title",
            content: "Trang chủ - Lumina Books"
        },
        {
            property: "og:description",
            content: "Khám phá hàng nghìn đầu sách mới nhất."
        }
    ],
});


</script>
<style></style>