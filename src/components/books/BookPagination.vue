  <template>
    <div class="d-flex justify-center my-8">
        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7" rounded="lg" density="comfortable"
            active-color="#0D2A52"></v-pagination>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    page: {
        type: Number,
        default: 1
    },
    totalPages: {
        type: Number,
        default: 1
    }
});

const emit = defineEmits(["change-page"]);

const currentPage = computed({
    get: () => props.page,
    set: (val) => emit("change-page", val)
});
</script>