<template>
  <div class="ma-4">
    <!-- Header -->
    <v-card elevation="1" rounded="lg" class="pa-4 mb-4">
      <div class="d-flex justify-space-between align-center flex-wrap ga-3">
        <div>
          <h1 class="text-h4 font-weight-bold ma-0">Quản Lý Thể Loại</h1>
          <p class="text-body-2 text-grey-darken-1 mt-1 mb-0">
            Quản trị danh mục và thể loại sách trong cửa hàng
          </p>
        </div>

        <div class="d-flex align-center ga-3">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            Thêm Thể Loại
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- Table -->
    <v-card elevation="1" rounded="lg">
      <v-table hover>
        <thead>
          <tr>
            <th class="text-center font-weight-bold" style="width: 80px">#</th>
            <th class="font-weight-bold">Tên thể loại</th>
            <th class="text-center font-weight-bold" style="width: 200px">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="3" class="text-center py-6 text-grey">
              <v-progress-circular indeterminate color="primary" size="28" class="me-2" />
              Đang tải danh sách thể loại...
            </td>
          </tr>
          <tr v-else-if="genres.length === 0">
            <td colspan="3" class="text-center py-8 text-grey">
              Chưa có thể loại nào.
            </td>
          </tr>
          <tr v-for="(genre, index) in genres" :key="genre.id">
            <td class="text-center text-caption text-grey">{{ index + 1 }}</td>
            <td class="font-weight-medium">
              <v-chip color="primary" variant="tonal" size="small" class="me-2">
                ID: {{ genre.id }}
              </v-chip>
              {{ genre.name }}
            </td>
            <td class="text-center">
              <div class="d-flex justify-center ga-2">
                <v-btn
                  size="small"
                  variant="outlined"
                  color="warning"
                  prepend-icon="mdi-pencil"
                  @click="openEditDialog(genre)"
                >
                  Sửa
                </v-btn>
                <v-btn
                  size="small"
                  variant="flat"
                  color="error"
                  prepend-icon="mdi-delete"
                  @click="openDeleteDialog(genre)"
                >
                  Xóa
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Dialog Thêm / Sửa Thể loại -->
    <v-dialog v-model="formDialog" max-width="450">
      <v-card class="rounded-xl">
        <v-card-title class="font-weight-bold pa-4 border-b">
          {{ isEditMode ? 'Cập nhật thể loại' : 'Thêm thể loại mới' }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-text-field
            v-model.trim="genreName"
            label="Tên thể loại *"
            variant="outlined"
            density="comfortable"
            placeholder="Ví dụ: Khoa học viễn tưởng"
            autofocus
            :rules="[v => !!v || 'Tên thể loại không được để trống']"
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-end ga-2">
          <v-btn variant="outlined" @click="formDialog = false" :disabled="submitting">Hủy</v-btn>
          <v-btn color="primary" class="font-weight-bold" :loading="submitting" @click="saveGenre">
            {{ isEditMode ? 'Lưu thay đổi' : 'Thêm mới' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Xác nhận Xóa -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="font-weight-bold pa-4 border-b text-error">
          Xác nhận xóa thể loại
        </v-card-title>
        <v-card-text class="pa-4">
          Bạn có chắc chắn muốn xóa thể loại <b>{{ targetGenre?.name }}</b> không?
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-end ga-2">
          <v-btn variant="outlined" @click="deleteDialog = false" :disabled="submitting">Hủy</v-btn>
          <v-btn color="error" class="font-weight-bold" :loading="submitting" @click="confirmDelete">
            Xóa vĩnh viễn
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import genreService from '@/services/genre.service';

const toast = useToast();

const genres = ref([]);
const loading = ref(false);
const submitting = ref(false);

const formDialog = ref(false);
const isEditMode = ref(false);
const genreName = ref('');
const targetGenre = ref(null);

const deleteDialog = ref(false);

const loadGenres = async () => {
  loading.value = true;
  try {
    const res = await genreService.getAllGenresNoPage();
    genres.value = res.data || res || [];
  } catch (error) {
    toast.error('Không thể tải danh sách thể loại.');
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  isEditMode.value = false;
  genreName.value = '';
  targetGenre.value = null;
  formDialog.value = true;
};

const openEditDialog = (genre) => {
  isEditMode.value = true;
  targetGenre.value = genre;
  genreName.value = genre.name;
  formDialog.value = true;
};

const openDeleteDialog = (genre) => {
  targetGenre.value = genre;
  deleteDialog.value = true;
};

const saveGenre = async () => {
  if (!genreName.value) {
    return toast.warning('Vui lòng nhập tên thể loại.');
  }
  submitting.value = true;
  try {
    if (isEditMode.value) {
      await genreService.updateGenre(targetGenre.value.id, { name: genreName.value });
      toast.success('Cập nhật thể loại thành công!');
    } else {
      await genreService.createGenre({ name: genreName.value });
      toast.success('Thêm mới thể loại thành công!');
    }
    formDialog.value = false;
    await loadGenres();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Thao tác thất bại.');
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = async () => {
  if (!targetGenre.value) return;
  submitting.value = true;
  try {
    await genreService.deleteGenre(targetGenre.value.id);
    toast.success('Xóa thể loại thành công!');
    deleteDialog.value = false;
    await loadGenres();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Xóa thể loại thất bại.');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadGenres();
});
</script>

<style scoped>
:deep(thead th) {
  background-color: #143d8f !important;
  color: white !important;
  font-size: 13px !important;
}
</style>
