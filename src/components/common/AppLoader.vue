<template>
    <div class="loading-overlay">
        <div class="loader"></div>
    </div>
</template>

<style scoped>
.loading-overlay {
    position: fixed;
    inset: 0;
    /* top:0 right:0 bottom:0 left:0 */
    background: rgba(255, 255, 255, 0.6);
    /* nền mờ */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loader {
    width: fit-content;
    font-weight: bold;
    font-family: monospace;
    font-size: 30px;
    clip-path: inset(0 3ch 0 0);
    animation: l4 1s steps(4) infinite;
}

.loader::before {
    content: "Loading...";
}

@keyframes l4 {
    to {
        clip-path: inset(0 -1ch 0 0);
    }
}
</style>