<template>
    <home-container class="home">
        <view v-if="isEmployee">
            <view class="home-item" @click="handleSearchPet">
                <image class="home-item-icon" src="@/assets/pages/icon2.png"></image>
                <view class="home-item-title">搜索宠物</view>
            </view>
            <view class="home-item" @click="handleAddPet">
                <image class="home-item-icon" src="@/assets/pages/icon3.png"></image>
                <view class="home-item-title">添加宠物</view>
            </view>
        </view>
        <view v-else>
            <view class="home-no-access"> 您没有权限访问,请联系管理员 </view>
        </view>
    </home-container>
</template>

<script setup lang="ts">
import homeContainer from "@/components/pages/homeContainer.vue";
import { useUserStore } from "@/stores/user";
import { computed } from "vue";
import { push } from "@/router/router";

uni.showShareMenu({
    withShareTicket: true,
    menus: ["shareAppMessage", "shareTimeline"],
});

const store = useUserStore();

const isEmployee = computed(() => {
    return [1, 2, 3].includes(store.role);
});

const handleSearchPet = () => {
    push({
        name: "petList",
    });
};

const handleAddPet = () => {
    push({
        name: "createPet",
    });
};
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
    &-no-access {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40rpx;
        backdrop-filter: blur(8rpx);
        background: #ffffffb2;
        border-radius: 20rpx;
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
</style>
