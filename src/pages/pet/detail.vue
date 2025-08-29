<script setup lang="ts">
import PetContainer from "@/components/common/petContainer.vue";
import avatar from "./components/avatar.vue";
import imageUploadPopup from "@/components/common/imageUploadPopup.vue";
import { onLoad } from "@dcloudio/uni-app";
import { PetModel, UploadModel } from "@/api";
import { ref, onMounted } from "vue";
import { baseUrl } from "@/config";
import genderIcon from "@/components/common/genderIcon.vue";
import PetDivider from "@/components/common/petDivider.vue";
import { push } from "@/router/router";

const petId = ref();

const popup = ref();

onLoad((props) => {
    petId.value = props.petId;
});

const petInfo = ref({});

const getPetDetail = () => {
    PetModel.getPetDetail(petId.value).then((res) => {
        if (res.status !== 0) {
            uni.showToast({
                title: res.message,
                icon: "none",
            });
            return Promise.reject(new Error(res.message));
        }
        petInfo.value = res.data;
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
        PetModel.updatePet({
            ...petInfo.value,
            avatar: avatarUrl,
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
                getPetDetail();
            })
            .finally(() => {
                uni.hideLoading();
            });
    });
};

const handleBaseInfo = () => {
    push({
        name: "petBaseDetail",
        query: {
            petId: petId.value,
        },
    });
};

const handleWashInfo = () => {
    push({
        name: "petWashDetail",
        query: {
            petId: petId.value,
        },
    });
};

const handleEntrustmentInfo = () => {
    push({
        name: "petEntrustmentDetail",
        query: {
            petId: petId.value,
        },
    });
};

onMounted(() => {
    getPetDetail();
});
</script>

<template>
    <pet-container background-color="#FFF5F8" title="宠物档案">
        <view class="container">
            <view class="profile" @click="handleEditAvatar">
                <avatar :image="petInfo.avatar"></avatar>
                <view class="profile-label">
                    <view>{{ petInfo.nickName }}</view>
                    <gender-icon :gender="petInfo.gender === '0' ? 'male' : 'female'"></gender-icon>
                </view>
            </view>
            <pet-divider></pet-divider>
            <view class="pet-detail">
                <view class="pet-detail-title">档案中心</view>
                <view class="pet-detail-row">
                    <view
                        class="pet-detail-row-small-item"
                        :style="{
                            background: `url(/static/bg/detail_bg1.png) no-repeat center center / cover`,
                        }"
                        @click="handleBaseInfo"
                    >
                        <image
                            class="pet-detail-row-small-item-icon"
                            src="@/assets/pages/icon5.png"
                        ></image>
                        <view class="pet-detail-row-small-item-title">基本资料</view>
                        <view class="pet-detail-row-small-item-subtitle"
                            >这里是基本资料及注意事项</view
                        >
                    </view>
                    <view
                        class="pet-detail-row-small-item"
                        :style="{
                            background: `url(/static/bg/detail_bg2.png) no-repeat center center / cover`,
                        }"
                        @click="handleWashInfo"
                    >
                        <image
                            class="pet-detail-row-small-item-icon"
                            src="@/assets/pages/icon4.png"
                        ></image>
                        <view class="pet-detail-row-small-item-title">洗护美容档案</view>
                        <view class="pet-detail-row-small-item-subtitle"
                            >这里是洗护美容及注意事项</view
                        >
                    </view>
                </view>
                <view class="pet-detail-row">
                    <view
                        class="pet-detail-row-item"
                        :style="{
                            background: `url(/static/bg/detail_bg3.png) no-repeat center center / cover`,
                        }"
                        @click="handleEntrustmentInfo"
                    >
                        <image
                            class="pet-detail-row-item-icon"
                            src="@/assets/pages/icon1.png"
                        ></image>
                        <view class="pet-detail-row-item-title">寄养档案</view>
                        <view class="pet-detail-row-item-subtitle"
                            >这里是餐食护理细节及注意事项</view
                        >
                    </view>
                </view>
            </view>
        </view>
    </pet-container>
    <image-upload-popup
        ref="popup"
        :image-count="1"
        @submit="handleChooseImage"
    ></image-upload-popup>
</template>

<style scoped lang="scss">
.container {
    .profile {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-bottom: 76rpx;
        &-label {
            font-family: PingFang SC;
            font-weight: 500;
            font-style: Medium;
            font-size: 32rpx;
            leading-trim: NONE;
            letter-spacing: -2%;
            text-align: center;
            margin-top: 10rpx;
            color: #402b2c;
        }
    }
    .pet-detail {
        padding: 28rpx;
        &-title {
            font-family: PingFang SC;
            font-weight: 500;
            font-style: Medium;
            font-size: 36rpx;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: -2%;
            color: #402b2c;
            margin-bottom: 28rpx;
        }
        &-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16rpx;
            &-item {
                border-radius: 12rpx;
                width: 100%;
                height: 280rpx;
                padding: 24rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                &-icon {
                    width: 120rpx;
                    height: 120rpx;
                    margin-bottom: 16rpx;
                }
                &-title {
                    font-family: PingFang SC;
                    font-weight: 500;
                    font-style: Medium;
                    font-size: 32rpx;
                    leading-trim: NONE;
                    line-height: 100%;
                    letter-spacing: 0%;
                    color: #402b2c;
                    margin-bottom: 12rpx;
                }
                &-subtitle {
                    font-family: PingFang SC;
                    font-weight: 400;
                    font-style: Regular;
                    font-size: 24rpx;
                    leading-trim: NONE;
                    line-height: 100%;
                    letter-spacing: 0%;
                    color: #402b2c;
                }
            }
            &-small-item {
                border-radius: 12rpx;
                width: 295rpx;
                height: 280rpx;
                padding: 24rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                &-icon {
                    width: 120rpx;
                    height: 120rpx;
                    margin-bottom: 16rpx;
                }
                &-title {
                    font-family: PingFang SC;
                    font-weight: 500;
                    font-style: Medium;
                    font-size: 32rpx;
                    leading-trim: NONE;
                    line-height: 100%;
                    letter-spacing: 0%;
                    color: #402b2c;
                    margin-bottom: 12rpx;
                }
                &-subtitle {
                    font-family: PingFang SC;
                    font-weight: 400;
                    font-style: Regular;
                    font-size: 24rpx;
                    leading-trim: NONE;
                    line-height: 100%;
                    letter-spacing: 0%;
                    color: #402b2c;
                }
            }
        }
    }
}
</style>
