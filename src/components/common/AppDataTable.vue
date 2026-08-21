<template>
    <v-data-table v-bind="$attrs" :headers="headers" :items="items" :page="page" :items-per-page="itemsPerPage"
        :items-length="itemsLength" :loading="loading" hover density="comfortable" hide-default-footer
        @update:page="emit('update:page', $event)" @update:items-per-page="emit('update:items-per-page', $event)">
        <!-- Forward tất cả slot từ cha -->
        <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
        </template>

        <!-- Footer custom -->
        <!-- <template #bottom>
            <div class="d-flex align-center justify-end pa-3 ga-4">

                <span class="text-body-2">
                    Số sách mỗi trang:
                </span>

                <v-select :model-value="itemsPerPage" :items="[5, 10, 25, 50, 100]" density="compact" variant="outlined"
                    hide-details width="100" @update:model-value="
                        emit('update:items-per-page', $event)
                        " />

                <span class="text-body-2">
                    {{ startItem }} - {{ endItem }}
                    trên {{ itemsLength }}
                </span>

                <v-pagination :model-value="page" :length="totalPages" :total-visible="5" density="comfortable"
                    rounded="circle" @update:model-value="
                        emit('update:page', $event)
                        " />

            </div>
        </template> -->
    </v-data-table>
</template>

<script setup>


defineOptions({
    inheritAttrs: false
})

const props = defineProps({
    headers: {
        type: Array,
        default: () => []
    },

    items: {
        type: Array,
        default: () => []
    },

    page: {
        type: Number,
        default: 1
    },

    itemsPerPage: {
        type: Number,
        default: 10
    },

    itemsLength: {
        type: Number,
        default: 0
    },

    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits([
    'update:page',
    'update:items-per-page'
])

// const totalPages = computed(() => {
//     if (props.itemsPerPage <= 0) {
//         return 1
//     }

//     return Math.ceil(
//         props.itemsLength / props.itemsPerPage
//     )
// })

// const startItem = computed(() => {
//     if (props.itemsLength === 0) {
//         return 0
//     }

//     return (
//         (props.page - 1) * props.itemsPerPage + 1
//     )
// })

// const endItem = computed(() => {
//     return Math.min(
//         props.page * props.itemsPerPage,
//         props.itemsLength
// })
 </script>