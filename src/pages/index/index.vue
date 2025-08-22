<template>
    <home-container class="home">
        <view class="home-item">
            <image class="home-item-icon" src="@/assets/pages/icon2.png"></image>
            <view class="home-item-title">搜索宠物</view>
        </view>
        <view class="home-item">
            <image class="home-item-icon" src="@/assets/pages/icon3.png"></image>
            <view class="home-item-title">添加宠物</view>
        </view>
    </home-container>
</template>

<script setup lang="ts">
import homeContainer from "@/components/pages/homeContainer.vue";
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    &-item {
        height: 212rpx;
        width: 660rpx;
        backdrop-filter: blur(8rpx);
        background: #ffffffb2;
        border-radius: 212rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        &-icon {
            height: 120rpx;
            width: 120rpx;
        }
        &-title {
            font-family: PingFang SC;
            font-weight: 500;
            font-style: Medium;
            font-size: 32rpx;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
            color: #5b4045;
        }
    }
    &-item + &-item {
        margin-top: 40rpx;
    }
}
</style>
