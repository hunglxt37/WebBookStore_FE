<template>
    <v-container class="fill-height d-flex justify-center align-center">
        <v-card width="430" rounded="xl" elevation="2" class="pa-8">
            <div class="text-center">

                <!-- <h1 class="text-primary">Lumina Books</h1> -->
                <v-img src="/images/lumina_books_logo.png" width="180" class="mx-auto " />
                <h3 class="mt-0"> Chào mừng trở lại! Đăng nhập để vào tài khoản của bạn.</h3>
            </div>

            <v-form @submit.prevent="onSubmit">

                <AppInput v-model="email" v-bind="emailProps" label="Email" placeholder="Nhập email"
                    prepend-inner-icon="mdi-email-outline" variant="outlined" class="mb-3"
                    :error-messages="errors.email" />

                <AppInput v-model="password" v-bind="passwordProps" label="Mật khẩu" type="password"
                    placeholder="Nhập mật khẩu" prepend-inner-icon="mdi-lock-outline" variant="outlined"
                    :error-messages="errors.password" />

                <AppButton color="warning" :loading="authStore.loading" class="mt-2" text="Đăng Nhập" type="submit"
                    block>
                    Đăng nhập
                </AppButton>
            </v-form>

            <v-row class="align-center my-6">
                <v-col>
                    <v-divider></v-divider>
                </v-col>

                <v-col cols="auto">
                    <span class="text-grey-darken-1 font-weight-medium text-no-wrap">
                        HOẶC TIẾP TỤC VỚI
                    </span>
                </v-col>

                <v-col>
                    <v-divider></v-divider>
                </v-col>
            </v-row>

            <!-- Social Login -->
            <v-row>
                <v-col cols="6">
                    <v-btn color="blue" block variant="outlined" size="large" prepend-icon="mdi-google">
                        <b>Google</b>
                    </v-btn>
                </v-col>

                <v-col cols="6">
                    <v-btn color="blue" block variant="outlined" size="large" prepend-icon="mdi-facebook">
                        <b>Facebook</b>
                    </v-btn>
                </v-col>
            </v-row>

            <!-- Register -->
            <div class="text-center mt-6">
                <span class="text-grey">
                    Chưa có tài khoản?
                </span>

                <RouterLink to="/auth/register" class="text-decoration-none font-weight-bold text-warning">
                    Đăng ký tài khoản mới
                </RouterLink>
            </div>
        </v-card>
    </v-container>
</template>

<script setup>

import AppInput from '../common/AppInput.vue';
import { useForm } from "vee-validate";
import { loginSchema } from "@/schemas/auth.schema";
import { useAuthStore } from '@/stores/auth.js';
import AppButton from '../common/AppButton.vue';


const {
    defineField,
    errors,
    handleSubmit,
} = useForm({
    validationSchema: loginSchema,
})

const [email, emailProps] = defineField("email")
const [password, passwordProps] = defineField("password")

const authStore = useAuthStore()

const onSubmit = handleSubmit(async (values) => {
    await authStore.login(values)
})



</script>

<style scoped></style>
