<script setup lang="ts">
import petContainer from "@/components/common/petContainer.vue";
import { useUserStore } from "@/stores/user";
import { computed } from "vue";
import { push } from "@/router/router";

const permission = {
    0: {
        title: "游客",
        color: "#666666",
        backgroundColor: "#F2F2F2",
    },
    1: {
        title: "员工",
        color: "#30A2FF",
        backgroundColor: "#E1EFFF",
    },
    2: {
        title: "管理员",
        color: "#ECB322",
        backgroundColor: "#FFFCC4",
    },
    3: {
        title: "超级管理员",
        color: "#FF72B8",
        backgroundColor: "#FFD7EB",
    },
    4: {
        title: "已离职",
        color: "#999999",
        backgroundColor: "#F5F5F5",
    },
};

const store = useUserStore();

const role = computed(() => {
    return permission[store.role as keyof typeof permission];
});

const handleEditNickname = () => {
    push({ name: "editNickname" });
};
</script>

<template>
    <pet-container class="mine" title="个人中心" navBarColor="#FFF5F8" backgroundColor="#FFF5F8">
        <view class="mine-profile">
            <image class="mine-profile-avatar" src="@/assets/default/avatar.jpg"></image>
            <view class="mine-profile-info">
                <view class="mine-profile-info-name" @click="handleEditNickname">{{
                    store.username
                }}</view>
                <view
                    class="mine-profile-info-permission"
                    :style="{ color: role.color, backgroundColor: role.backgroundColor }"
                    >{{ role.title }}
                </view>
            </view>
        </view>
    </pet-container>
</template>

<style lang="scss" scoped>
.mine {
    position: relative;
    &-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: #fff5f8;
        &-avatar {
            width: 160rpx;
            height: 160rpx;
            border-radius: 100%;
        }
        &-info {
            margin-top: 16rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            &-name {
                position: relative;
                font-family: PingFang SC;
                font-weight: 500;
                font-style: Medium;
                font-size: 20px;
                leading-trim: NONE;
                line-height: 32px;
                letter-spacing: -2%;
                text-align: center;
                color: #402b2c;
                &:after {
                    position: relative;
                    content: "";
                    background: url("@/assets/icons/edit.png") no-repeat center center / cover;
                    width: 28rpx;
                    height: 28rpx;
                    display: inline-block;
                    margin-left: 8rpx;
                }
            }
            &-permission {
                font-family: PingFang SC;
                font-weight: 500;
                font-style: Medium;
                font-size: 28rpx;
                leading-trim: NONE;
                line-height: 135%;
                letter-spacing: 0%;
                text-align: center;
                padding: 4rpx 18rpx;
                border-radius: 100rpx;
                flex-grow: 0;
            }
        }
    }
}
</style>
