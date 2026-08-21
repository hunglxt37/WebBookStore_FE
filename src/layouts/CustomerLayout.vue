<script setup>
import Footer from '@/components/customer/Footer.vue';
import Header from '@/components/customer/Header.vue';
</script>

<template>

    <div>
        <Header />

        <v-main>
            <RouterView />
        </v-main>

        <Footer />
    </div>

</template>