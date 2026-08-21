<template>
    <v-breadcrumbs :items="breadcrumbItems" class="px-0 py-2">

        <template #divider>
            <v-icon icon="mdi-chevron-right" size="14" />
        </template>

    </v-breadcrumbs>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const breadcrumbItems = computed(() => {

    return route.matched

        .filter(routeRecord => routeRecord.meta?.breadcrumb)

        .map(routeRecord => ({
            title: routeRecord.meta.breadcrumb,

            disabled: routeRecord.name === route.name,

            to: {
                name: routeRecord.name,
            },
        }));

});

</script>