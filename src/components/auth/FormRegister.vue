<template>
  <v-container class="fill-height d-flex justify-center align-center py-8">
    <v-card width="500" rounded="xl" elevation="2" class="pa-8">
      <div class="text-center mb-6">
        <v-img src="/images/lumina_books_logo.png" width="160" class="mx-auto mb-2" />
        <h2 class="text-h6 font-weight-bold ma-0">Tạo Tài Khoản Mới</h2>
        <p class="text-caption text-grey mt-1">Đăng ký thành viên Lumina Books để nhận ưu đãi</p>
      </div>

      <v-form @submit.prevent="onSubmit">
        <v-row dense>
          <!-- Full Name -->
          <v-col cols="12">
            <AppInput
              v-model="fullName"
              v-bind="fullNameProps"
              label="Họ và tên *"
              placeholder="Nguyễn Văn A"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
              :error-messages="errors.fullName"
            />
          </v-col>

          <!-- Email -->
          <v-col cols="12" sm="6">
            <AppInput
              v-model="email"
              v-bind="emailProps"
              label="Email *"
              placeholder="example@gmail.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              :error-messages="errors.email"
            />
          </v-col>

          <!-- Phone -->
          <v-col cols="12" sm="6">
            <AppInput
              v-model="phone"
              v-bind="phoneProps"
              label="Số điện thoại *"
              placeholder="0912345678"
              prepend-inner-icon="mdi-phone-outline"
              variant="outlined"
              :error-messages="errors.phone"
            />
          </v-col>

          <!-- Username -->
          <v-col cols="12">
            <AppInput
              v-model="username"
              v-bind="usernameProps"
              label="Tên đăng nhập *"
              placeholder="nguyenvana"
              prepend-inner-icon="mdi-card-account-details-outline"
              variant="outlined"
              :error-messages="errors.username"
            />
          </v-col>

          <!-- Password -->
          <v-col cols="12" sm="6">
            <AppInput
              v-model="password"
              v-bind="passwordProps"
              label="Mật khẩu *"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              :error-messages="errors.password"
            />
          </v-col>

          <!-- Confirm Password -->
          <v-col cols="12" sm="6">
            <AppInput
              v-model="confirmPassword"
              v-bind="confirmPasswordProps"
              label="Xác nhận mật khẩu *"
              type="password"
              placeholder="Nhập lại mật khẩu"
              prepend-inner-icon="mdi-lock-check-outline"
              variant="outlined"
              :error-messages="errors.confirmPassword"
            />
          </v-col>

          <!-- Gender -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="gender"
              v-bind="genderProps"
              :items="[
                { label: 'Nam', value: 'MALE' },
                { label: 'Nữ', value: 'FEMALE' },
                { label: 'Khác', value: 'OTHER' }
              ]"
              item-title="label"
              item-value="value"
              label="Giới tính"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-gender-male-female"
            />
          </v-col>

          <!-- Date of birth -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="dob"
              v-bind="dobProps"
              type="date"
              label="Ngày sinh"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar-outline"
            />
          </v-col>
        </v-row>

        <AppButton
          color="warning"
          :loading="authStore.loading"
          class="mt-4 font-weight-bold"
          text="Đăng Ký Tài Khoản"
          type="submit"
          block
        />
      </v-form>

      <!-- Back to Login -->
      <div class="text-center mt-6">
        <span class="text-grey">Đã có tài khoản? </span>
        <RouterLink to="/auth/login" class="text-decoration-none font-weight-bold text-warning">
          Đăng nhập ngay
        </RouterLink>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import AppInput from '@/components/common/AppInput.vue';
import AppButton from '@/components/common/AppButton.vue';
import { useForm } from 'vee-validate';
import { registerSchema } from '@/schemas/auth.schema';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: 'MALE',
    dob: ''
  }
});

const [fullName, fullNameProps] = defineField('fullName');
const [email, emailProps] = defineField('email');
const [phone, phoneProps] = defineField('phone');
const [username, usernameProps] = defineField('username');
const [password, passwordProps] = defineField('password');
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword');
const [gender, genderProps] = defineField('gender');
const [dob, dobProps] = defineField('dob');

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    fullName: values.fullName,
    email: values.email,
    phone: values.phone,
    username: values.username,
    password: values.password,
    gender: values.gender || null,
    dob: values.dob || null
  };
  await authStore.register(payload);
});
</script>
