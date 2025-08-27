<script setup lang="ts">
import { back, switchTab } from "@/router/router";

const handleBack = () => {
    back();
};

const handleHome = () => {
    switchTab({
        name: "home",
    });
};
</script>

<template>
    <view class="nav-bubble">
        <view @click="handleBack">
            <uni-icons type="left" size="16" color="#fff"></uni-icons>
        </view>
        |
        <view @click="handleHome">
            <uni-icons type="home-filled" size="16" color="#fff"></uni-icons>
        </view>
    </view>
</template>

<style scoped lang="scss">
.nav-bubble {
    position: fixed;
    top: calc(var(--status-bar-height) + 50rpx);
    left: 30rpx;
    width: 100rpx;
    height: 40rpx;
    padding: 14rpx 30rpx;
    background: #00000033;
    border-radius: 100rpx;
    text-align: center;
    line-height: 40rpx;
    color: #fff;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
