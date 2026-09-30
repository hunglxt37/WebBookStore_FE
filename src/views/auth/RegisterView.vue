<template>
  <div>
    <FormRegister />
  </div>
</template>

<script setup>
import FormRegister from '@/components/auth/FormRegister.vue';
import { useHead } from '@unhead/vue';

useHead({
  title: 'Đăng ký tài khoản - Lumina Books',
  meta: [
    {
      name: 'description',
      content: 'Đăng ký tài khoản Lumina Books để trải nghiệm mua sắm tiện lợi.'
    },
    {
      property: 'og:title',
      content: 'Đăng ký - Lumina Books'
    }
  ]
});
</script>

<style scoped></style>
