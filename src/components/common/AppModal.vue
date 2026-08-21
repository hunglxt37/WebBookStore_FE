<template>
    <v-dialog v-model="model" max-width="900px" scrollable>
        <v-card rounded="lg">

            <!-- Header -->
            <v-card-title class="d-flex align-center justify-space-between">
                <span class="text-h6 font-weight-bold">
                    {{ title }}
                </span>

                <v-btn icon="mdi-close" variant="text" @click="close" />
            </v-card-title>

            <v-divider />

            <!-- Body -->
            <v-card-text>
                <slot />
            </v-card-text>

            <v-divider />

            <!-- Footer -->
            <v-card-actions class="pa-4">
                <v-spacer />

                <v-btn variant="outlined" @click="close">
                    Hủy
                </v-btn>

                <v-btn v-if="showSubmit" :color="submitColor" @click="submit">
                    {{ submitText }}
                </v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script setup>

const model = defineModel()

defineProps({
    title: {
        type: String,
        default: ""
    },

    submitText: {
        type: String,
        default: "Lưu"
    },

    submitColor: {
        type: String,
        default: "primary"
    },

    showSubmit: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(["submit"])

const close = () => {
    model.value = false
}

const submit = () => {
    emit("submit")
}

</script>