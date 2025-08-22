<script setup lang="ts">
import navBubble from "./navBubble.vue";
import { ref, onMounted } from "vue";
import { getCurrentRouteName } from "@/router/router";

const isHome = ref(false);

onMounted(() => {
    const routeName = getCurrentRouteName();
    isHome.value = routeName === "home";
});
</script>

<template>
    <view class="status-bar">
        <nav-bubble v-if="!isHome"></nav-bubble>
    </view>
</template>

<style lang="scss" scoped>
.status-bar {
    position: relative;
    height: var(--status-bar-height);
    width: 100vw;
}
</style>
