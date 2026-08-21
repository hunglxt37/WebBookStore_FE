<template>
    <ul class="nav-list">
        <li>
            <a class="nav-link active font-weight-medium" href="#">
                Danh mục
            </a>
        </li>
        <li>
            <a class="nav-link" href="#">
                Sách mới
            </a>
        </li>
        <li>
            <a class="nav-link" href="#">
                Bán chạy
            </a>
        </li>
        <li>
            <a class="nav-link" href="#">
                Khuyến mãi
            </a>
        </li>
    </ul>
</template>

<style scoped>
.nav-list {
    display: flex;
    list-style: none;
    padding-left: 0;
    margin: 0 auto;
    gap: 20px;
}

.nav-link {
    color: #333;
    font-weight: 500;
    text-decoration: none;
    padding: 8px 12px;
    display: inline-block;
    transition: color 0.2s, border-color 0.2s;
}

.nav-link.active {
    color: #0d6efd;
    border-bottom: 2px solid #0d6efd;
}

.nav-link:hover {
    color: #0d6efd;
}

@media (max-width: 991px) {
    .nav-list {
        flex-direction: column;
        width: 100%;
        margin-top: 15px;
        gap: 10px;
    }
}
</style>