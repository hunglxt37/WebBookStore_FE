<template>
    <aside class="sidebar d-flex flex-column">

        <!-- Logo -->
        <div class="pa-4">
            <h1 class="font-weight-bold text-white mb-1">
                Lumina Books
            </h1>
        </div>

        <!-- Menu -->
        <ul class="nav-menu px-3 mt-4">

            <!-- Dashboard -->
            <li class="mb-2">
                <RouterLink class="nav-link" active-class="active" to="/admin">
                    <span>
                        <v-icon icon="mdi-view-dashboard" size="small" class="me-2"></v-icon>
                        Dashboard
                    </span>
                </RouterLink>
            </li>

            <!-- Books -->
            <li class="mb-2">
                <a class="nav-link" :class="{ 'collapsed': !isBookMenuOpen }"
                    @click.prevent="isBookMenuOpen = !isBookMenuOpen" href="#">
                    <span>
                        <v-icon icon="mdi-book-open-page-variant" size="small" class="me-2"></v-icon>
                        Books Management
                    </span>
                    <v-icon :icon="isBookMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="small"></v-icon>
                </a>

                <div v-show="isBookMenuOpen">
                    <ul class="submenu-list">
                        <li>
                            <RouterLink class="nav-link" active-class="active" to="/admin/book-management">
                                <span>
                                    <v-icon icon="mdi-book-open-page-variant" size="small" class="me-2"></v-icon>
                                    All Books
                                </span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink class="nav-link" active-class="active" to="/admin/books/create">
                                <span>
                                    <v-icon icon="mdi-plus-circle" size="small" class="me-2"></v-icon>
                                    Add Book
                                </span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink class="nav-link" active-class="active" to="/admin/genre">
                                <span>
                                    <v-icon icon="mdi-tag" size="small" class="me-2"></v-icon>
                                    Genre Management
                                </span>
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </li>

            <!-- Orders -->
            <li class="mb-2">
                <RouterLink class="nav-link" active-class="active" to="/admin/orders">
                    <span>
                        <v-icon icon="mdi-cart" size="small" class="me-2"></v-icon>
                        Orders
                    </span>
                </RouterLink>
            </li>

            <!-- Users -->
            <li>
                <RouterLink class="nav-link" active-class="active" to="/admin/users">
                    <span>
                        <v-icon icon="mdi-account-group" size="small" class="me-2"></v-icon>
                        Users
                    </span>
                </RouterLink>
            </li>

        </ul>

        <!-- Logout -->
        <div class="mt-auto pa-3">
            <a class="nav-link logout-link" href="#" @click="authStore.logout()">
                <span>
                    <v-icon icon=" mdi-logout" size="small" class="me-2"></v-icon>
                    Log Out
                </span>
            </a>
        </div>

    </aside>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const isBookMenuOpen = ref(false);
const authStore = useAuthStore();
</script>

<style scoped>
.sidebar {
    width: 270px;
    min-height: 100vh;
    background: #07264d;
}

.text-secondary {
    color: #a0aec0 !important;
}

/* =======================
      MENU
======================= */
.nav-menu {
    list-style: none;
    padding-left: 0;
}

.nav-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    margin-bottom: 6px;
    border-radius: 12px;
    color: #d9e5f1;
    text-decoration: none;
    transition: .25s;
    font-weight: 600;
}

.nav-link span {
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
}

.nav-link:hover {
    background: #163d6e;
    color: #fff;
    transform: translateX(4px);
}

/* Active */
.nav-link.active,
.router-link-active {
    background: #204b81;
    color: white;
    border-left: 4px solid #4ea8ff;
    padding-left: 14px;
}

/* =======================
      ICON
======================= */
.nav-link i,
.nav-link :deep(.v-icon) {
    transition: .25s;
}

.nav-link:hover :deep(.v-icon) {
    color: #4ea8ff;
}

/* =======================
      SUBMENU
======================= */
.submenu-list {
    margin-top: 8px;
    margin-left: 18px;
    padding-left: 18px;
    border-left: 1px solid rgba(255, 255, 255, .15);
    list-style: none;
}

.submenu-list .nav-link {
    justify-content: flex-start;
    gap: 10px;
    font-size: 15px;
    padding: 10px 14px;
    color: #c7d4e6;
}

.submenu-list .nav-link:hover {
    background: #1d4d82;
    transform: translateX(6px);
}

.submenu-list .router-link-active {
    background: #204b81;
    border-left: 3px solid #4ea8ff;
}

/* =======================
      LOGOUT
======================= */
.logout-link:hover {
    background: #8b1e1e;
}
</style>