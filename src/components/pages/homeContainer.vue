<script setup lang="ts">
import petNavbar from "../common/petNavbar.vue";
import { ref, onMounted } from "vue";

const visible = ref(false);

onMounted(() => {
    visible.value = true;
});
</script>

<template>
    <view class="container">
        <pet-navbar></pet-navbar>
        <view class="container-slogan">BIRKIN PET</view>
        <image class="container-logo" src="@/assets/pages/bg-logo.png"></image>
        <view class="container-main" :class="{ active: visible }">
            <slot></slot>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.container {
    position: relative;
    background: url("@/assets/pages/bg.jpg") no-repeat center center / cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    &-slogan {
        font-size: 36rpx;
        leading-trim: NONE;
        line-height: 100%;
        letter-spacing: 0%;
        text-align: center;
        color: #ff738f;
        height: 96rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40rpx;
    }
    &-logo {
        width: 614rpx;
        height: 190rpx;
        margin-top: 96rpx;
        margin-bottom: 104rpx;
    }
    &-main {
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.5s ease-out;
        width: 660rpx;
        &.active {
            opacity: 1;
            transform: translateY(0);
        }
    }
}
</style>
