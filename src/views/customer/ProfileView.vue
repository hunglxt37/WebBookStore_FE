<template>
  <v-container class="py-6 profile-view">
    <v-row justify="center">
      <v-col cols="12" md="9" lg="8">
        <!-- Header -->
        <div class="d-flex align-center mb-6">
          <v-btn icon="mdi-arrow-left" variant="text" class="me-2" @click="router.back()" />
          <div>
            <h1 class="text-h5 font-weight-bold ma-0">Hồ Sơ Của Tôi</h1>
            <p class="text-body-2 text-grey-darken-1 ma-0 mt-1">
              Quản lý thông tin tài khoản và địa chỉ nhận hàng
            </p>
          </div>
        </div>

        <v-card class="pa-6 rounded-xl" elevation="1">
          <v-form @submit.prevent="handleSubmit">
            <!-- Avatar & Overview -->
            <div class="d-flex align-center mb-6 pb-6 border-b">
              <v-avatar size="80" color="primary" class="me-4 elevation-1">
                <v-img v-if="formData.avatar" :src="formData.avatar" alt="Avatar" cover />
                <v-icon v-else icon="mdi-account" size="48" color="white" />
              </v-avatar>
              <div>
                <h2 class="text-h6 font-weight-bold ma-0">{{ formData.fullName || 'Người dùng Lumina' }}</h2>
                <p class="text-caption text-grey mb-1">@{{ formData.username }}</p>
                <v-chip size="x-small" color="success" variant="flat">
                  {{ formData.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa' }}
                </v-chip>
              </div>
            </div>

            <v-row>
              <!-- Full name -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.trim="formData.fullName"
                  label="Họ và tên"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-account-outline"
                  :rules="[v => !!v || 'Họ và tên không được để trống']"
                />
              </v-col>

              <!-- Phone -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.trim="formData.phone"
                  label="Số điện thoại"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-phone-outline"
                  :rules="[
                    v => !v || /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(v) || 'Số điện thoại không đúng định dạng'
                  ]"
                />
              </v-col>

              <!-- Email (read-only) -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email (Không thể thay đổi)"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-email-outline"
                  disabled
                />
              </v-col>

              <!-- Username (read-only) -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.username"
                  label="Tên đăng nhập"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-card-account-details-outline"
                  disabled
                />
              </v-col>

              <!-- Gender -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.gender"
                  :items="genderOptions"
                  item-title="label"
                  item-value="value"
                  label="Giới tính"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-gender-male-female"
                />
              </v-col>

              <!-- Date of Birth -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.dob"
                  type="date"
                  label="Ngày sinh"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-calendar-outline"
                />
              </v-col>

              <!-- Avatar URL -->
              <v-col cols="12">
                <v-text-field
                  v-model.trim="formData.avatar"
                  label="URL Ảnh đại diện"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-image-outline"
                  placeholder="https://..."
                />
              </v-col>

              <!-- Shipping Address -->
              <v-col cols="12">
                <v-textarea
                  v-model.trim="formData.shippingAddress"
                  label="Địa chỉ giao hàng mặc định"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-map-marker-outline"
                  rows="2"
                  auto-grow
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                />
              </v-col>

              <!-- Billing Address -->
              <v-col cols="12">
                <v-textarea
                  v-model.trim="formData.billingAddress"
                  label="Địa chỉ thanh toán"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-receipt-text-outline"
                  rows="2"
                  auto-grow
                  placeholder="Địa chỉ xuất hóa đơn (nếu có)..."
                />
              </v-col>
            </v-row>

            <!-- Actions -->
            <div class="d-flex justify-end ga-3 mt-4">
              <v-btn variant="outlined" color="grey-darken-1" @click="loadProfile" :disabled="loading">
                Khôi phục
              </v-btn>
              <v-btn type="submit" color="primary" class="font-weight-bold" :loading="saving">
                Lưu Thay Đổi
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import userService from '@/services/user.service';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const loading = ref(false);
const saving = ref(false);

const genderOptions = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' }
];

const formData = reactive({
  fullName: '',
  email: '',
  username: '',
  phone: '',
  gender: 'MALE',
  dob: '',
  avatar: '',
  shippingAddress: '',
  billingAddress: '',
  status: 'ACTIVE'
});

const loadProfile = async () => {
  loading.value = true;
  try {
    const res = await userService.getProfile();
    const data = res.data || res;
    formData.fullName = data.fullName || '';
    formData.email = data.email || '';
    formData.username = data.username || '';
    formData.phone = data.phone || '';
    formData.gender = data.gender || 'MALE';
    formData.dob = data.dob || '';
    formData.avatar = data.avatar || '';
    formData.shippingAddress = data.shippingAddress || '';
    formData.billingAddress = data.billingAddress || '';
    formData.status = data.status || 'ACTIVE';
  } catch (error) {
    toast.error('Không thể tải thông tin hồ sơ.');
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!formData.fullName) {
    return toast.warning('Họ và tên không được để trống.');
  }

  saving.value = true;
  try {
    const payload = {
      fullName: formData.fullName,
      phone: formData.phone || null,
      gender: formData.gender,
      dob: formData.dob || null,
      avatar: formData.avatar || null,
      shippingAddress: formData.shippingAddress || null,
      billingAddress: formData.billingAddress || null
    };

    const res = await userService.updateProfile(payload);
    toast.success('Cập nhật hồ sơ thành công!');
    await authStore.getUserProfile();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-view {
  max-width: 900px;
}
</style>
