<script setup lang="ts">
import navBubble from "./navBubble.vue";
import { ref, onMounted } from "vue";
import { getCurrentRouteName } from "@/router/router";

const isHome = ref(false);

const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    navBarColor: {
        type: String,
        default: "",
    },
});

onMounted(() => {
    const routeName = getCurrentRouteName();
    isHome.value = routeName === "home";
});
</script>

<template>
    <view class="status-bar">
        <nav-bubble v-if="!isHome"></nav-bubble>
        <view class="status-bar-title">{{ props.title }}</view>
        <view />
    </view>
</template>

<style lang="scss" scoped>
.status-bar {
    position: relative;
    height: calc(var(--status-bar-height) + 116rpx);
    width: 100vw;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: v-bind(navBarColor);
    &-title {
        margin-bottom: 16rpx;
        font-family: PingFang SC;
        font-weight: 500;
        font-style: Medium;
        font-size: 16px;
        leading-trim: NONE;
        line-height: 100%;
        letter-spacing: 0%;
        text-align: center;
        color: #402b2c;
    }
}
</style>
