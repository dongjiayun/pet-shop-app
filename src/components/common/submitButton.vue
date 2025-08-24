<script setup lang="ts"></script>

<template>
    <view class="submit-button" @click="$emit('click')">
        <slot></slot>
    </view>
</template>

<style scoped lang="scss">
.submit-button {
    height: 100rpx;
    border-radius: 32rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ff9ece;
    color: #fff;
    font-family: PingFang SC;
    font-weight: 500;
    font-style: Medium;
    font-size: 32rpx;
    leading-trim: NONE;
    line-height: 135%;
    letter-spacing: 0%;
    text-align: center;
}
</style>
