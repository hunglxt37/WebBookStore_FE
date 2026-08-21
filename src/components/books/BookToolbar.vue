<template>
    <v-card class="pa-4 mb-4" rounded="lg" elevation="1">

        <v-row align="center">

            <!-- Chiếm 3/4 -->
            <v-col cols="12" md="9">

                <div class="d-flex align-center ga-3">

                    <h3 class="text-nowrap">
                        Sắp xếp theo:
                    </h3>

                    <v-select :model-value="sortBy" :items="sortItems" item-title="title" item-value="value"
                        density="compact" hide-details variant="outlined" style="width: 280px"
                        @update:model-value="changeSort" />

                    <v-select :model-value="size" :items="sizePage" item-title="title" item-value="value"
                        density="compact" hide-details variant="outlined" style="width: 280px"
                        @update:model-value="changeSize" />

                </div>

            </v-col>

            <!-- 1/4 còn lại để trống -->
            <v-col cols="12" md="3">
            </v-col>

        </v-row>

    </v-card>
</template>

<script setup>
import { number } from 'yup';


const props = defineProps({
    sortBy: {
        type: String,
        default: "newest",
    },
    size: {
        type: number,
        default: 12
    }
});

const sortItems = [
    {
        title: "Mới nhất",
        value: "newest",
    },
    {
        title: "Cũ nhất",
        value: "oldest",
    },
];
const sizePage = [
    {
        title: "12 sản phẩm",
        value: 12,
    },
    {
        title: "24 sản phẩm",
        value: 4,
    },
    {
        title: "48 sản phẩm",
        value: 8,
    },
]

const emit = defineEmits(["change-sort", "change-size"]);

const changeSort = (value) => {
    emit("change-sort", value);
};

const changeSize = (value) => {
    emit("change-size", value);
};

</script>
<style scoped></style>