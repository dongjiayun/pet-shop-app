<script setup lang="ts">
import petContainer from "@/components/common/petContainer.vue";
import { useUserStore } from "@/stores/user";
import { computed } from "vue";
import { push } from "@/router/router";
import PetDivider from "@/components/common/petDivider.vue";
import PetPopup from "@/components/common/petPopup.vue";
import ImageUploadPopup from "@/components/common/imageUploadPopup.vue";
import { ref } from "vue";
import { UserModel, UploadModel } from "@/api";
import { baseUrl } from "@/config";

const logoutPopup = ref();

const popup = ref();

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

const handleMineCustomer = () => {
    push({
        name: "petList",
        query: {
            isSelf: true,
        },
    });
};

const handleLogout = () => {
    logoutPopup.value.open();
};

const handleSubmitLogout = () => {
    store.logout();
};

const handleAuthorization = () => {
    push({
        name: "authorization",
    });
};

const handleHistory = () => {
    push({
        name: "petList",
        query: {
            isHistory: true,
        },
    });
};

const handleEditAvatar = () => {
    popup.value.open();
};

const handleChooseImage = (files) => {
    const avatar = files?.[0];
    uni.showLoading({
        title: "上传中",
        mask: true,
    });
    UploadModel.uploadPic({
        file: avatar,
    }).then((res) => {
        uni.hideLoading();
        if (res.status !== 0) {
            uni.showToast({
                title: res.message,
                icon: "none",
            });
            uni.hideLoading();
            return Promise.reject(new Error(res.message));
        }
        const avatarUrl = baseUrl + res.data;
        UserModel.updateUserInfo({
            cid: store.cid,
            avatar: { fileUrl: avatarUrl },
        })
            .then((res) => {
                if (res.status !== 0) {
                    uni.showToast({
                        title: res.message,
                        icon: "none",
                    });
                    return Promise.reject(new Error(res.message));
                }
                setTimeout(() => {
                    uni.showToast({
                        title: "修改成功",
                    });
                }, 500);
                store.getUserInfo();
            })
            .finally(() => {
                uni.hideLoading();
            });
    });
};
</script>

<template>
    <pet-container class="mine" title="个人中心" navBarColor="#FFF5F8" backgroundColor="#FFF5F8">
        <view class="mine-profile">
            <image
                @click="handleEditAvatar"
                class="mine-profile-avatar"
                :src="store.avatar || '/static/icons/avatar.jpg'"
            ></image>
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
        <pet-divider></pet-divider>
        <view class="mine-list">
            <view
                class="mine-list-item"
                @click="handleMineCustomer"
                v-if="[1, 2, 3].includes(store.role)"
            >
                <image src="@/assets/icons/myCustomer.png" class="mine-list-item-icon"></image>
                <view class="mine-list-item-label">与我相关的宠物</view>
                <image src="@/assets/icons/left.png" class="mine-list-item-right"></image>
            </view>
            <view class="mine-list-item" v-if="[2, 3].includes(store.role)" @click="handleHistory">
                <image src="@/assets/icons/history.png" class="mine-list-item-icon"></image>
                <view class="mine-list-item-label">宠物档案变更记录</view>
                <image src="@/assets/icons/left.png" class="mine-list-item-right"></image>
            </view>
            <view
                class="mine-list-item"
                v-if="[3].includes(store.role)"
                @click="handleAuthorization"
            >
                <image src="@/assets/icons/authorization.png" class="mine-list-item-icon"></image>
                <view class="mine-list-item-label">权限设置</view>
                <image src="@/assets/icons/left.png" class="mine-list-item-right"></image>
            </view>
            <view class="mine-list-item" @click="handleLogout">
                <uni-icons type="undo" size="20"></uni-icons>
                <view class="mine-list-item-label">退出登录</view>
                <image src="@/assets/icons/left.png" class="mine-list-item-right"></image>
            </view>
        </view>
    </pet-container>
    <pet-popup ref="logoutPopup" title="退出登录" @submit="handleSubmitLogout">
        <view style="text-align: center; margin-bottom: 32rpx"> 您确定要退出登录吗 </view>
    </pet-popup>
    <image-upload-popup
        ref="popup"
        :image-count="1"
        @submit="handleChooseImage"
    ></image-upload-popup>
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
        margin-bottom: 64rpx;
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
    &-list {
        &-item {
            display: flex;
            align-items: center;
            padding: 52rpx 32rpx;
            &-icon {
                width: 40rpx;
                height: 40rpx;
            }
            &-label {
                font-family: PingFang SC;
                font-weight: 400;
                font-style: Regular;
                font-size: 32rpx;
                leading-trim: NONE;
                line-height: 135%;
                letter-spacing: -0.5%;
                flex: 1;
                margin-left: 16rpx;
                color: #402b2c;
            }
            &-right {
                width: 32rpx;
                height: 32rpx;
            }
        }
    }
}
</style>
