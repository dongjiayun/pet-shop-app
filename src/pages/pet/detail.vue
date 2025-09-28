<script setup lang="ts">
import PetContainer from "@/components/common/petContainer.vue";
import avatar from "./components/avatar.vue";
import imageUploadPopup from "@/components/common/imageUploadPopup.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { PetModel, UploadModel } from "@/api";
import { ref } from "vue";
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

onShow(() => {
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
                        style="
                            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACMBAMAAAAaWP+nAAAAKlBMVEX/78/96rz9787/7cf/8M/+7MH/7sr+6rj+6bj/7cT/7ML/7sf+67z+67/hRwGBAAAABHRSTlOAgICAacTQSgAACHFJREFUaN6tmkmv0zAQx/loCMxAyOOAhAtxQULIDZTCAQmYAO2BA9gIuKWBtnBAkEKDuOWV9Vi1rAfELvgwOCxdYmeD/g9Pek36y3hmPB672UJ+qcticJ+GUUzKawMv7JES8TJJaesfqOvaka/+kgra0/Z/Qc+aoYk26T2oxCQwHiuowGkmFCj1N6nPq1BvXmtJKa/zTKjb67k09EmGTIMAIXnTGROSPXzgtjPKNHST6Zcs9HiXw6HFFUhDldzswXeprwcKz+yQk2M4mTNpoEHz1I10qNWuHcXJF/xI/shm9UrQTTokmlwyw8/Y5n+Qg+PRqAIU+pSy2BSqjvu2Nn9uyB5WgFqMUuoYPP40JvO06EfR3Ke8DJQmquff2mcLqFMiM62wGyrqkBM3G9qkjP4NFONm5k3pL/7pBW6XhnTYpLVs6vNnEeW/oRExqfVIysnqU5SxSg7Jlk2pnzP8k56U8jSQhTixEyYb5WYzrf+GJnRNX1FK8fHrvmVLSVMx6SAP2ogY/w0NHxryD9GTgbiQ+g6lQW4G2FHo/4ayugHqoSdccSb1MaX5KwMk40+gYWgI6AFPeB0y06DML5rN1OUK2uvFhnG8lOIqeXIu9XFI/eJZ4vCMaerCAVl/93xfOr/1gqs5SD1YQbnhmvwMgw15mVSWSuYoMFu6G68A31AOqCpgofK7GWph58QlC6tDXRYN+hk+hVnngFebnf0HS6M4s56evLIfJy/2/YNPGc+EEv4Ep+QfZI/zKv8enJAcZTczeVByy89BkhOenwutLvhR249n1wzdgW1ZCsorQE+i0qQYeuI1ufXZnAcmS5VK+PQLPhRtc+HRaz18ldgpjj7MENHjBjv5ZhQbllrh8TKWokBumHZjU79H9giMi6GPBYpLpqLrGJcQW+K9YqgqysKwrDSSVdlYcPFjMZTslNe4eXmoE4O+pvMUTNANIxRCyhzjHgIvrA5pNjVC26Z4wnHGTNBjYimn4OBblWPlocRmxrV+Q+DSE6QU2DZA92RAgRmX5R3LOXUggXaA61BhhpJ+WDMNQOBnPo+aQMSzNy+UhzaM3SMo4+atxpMEuu/rmZzh61lluNCQYjGtrZcS23zWyYcWd2VPFHTu1fFuKa+QLyZL0RwoEpq2UPtRIvI/QZPxSVkLjp7ToCckxlntseMCSek+TueW7cQpcY/J55/TUFBuyYwUpQFJ6QTG8xTawMtNfgw/anm6ISXix0xoXT9AWG6SrsrpMTHRoEeTejrJGD6lD0me9n/Dzgbu09covD4zWwqMjQqgdgvbVptrUEvce2yOFERR3IxJrgDbMDAddxAIkgQCffgOJ0U6cKagmUgj7AEplPU5BwoAT4fkv6RDm0OLDglfK9Sl9UYY2M5aoTt6w0aPdylfJ7TRjxsDYD1YJ9QOOHA7Gqw3UOB26xAFJFstXjlQYUgpb+WcpMHLS5UDRZVi6GbPyj3Sm1YN1C9oI3Ov7PobWtktB/UbNMvSG9c3pPTOVIx+Ah02sioIYHuHlBKn1aLf6ipoMyv6tiqbCfRMNShphlGNkEzo1P7V4axUxqAQCiENIAsKn1xI1rJzK22BUwgldi8nuJYMXspr7xZ37HaaESVpbau043viTZrOGBbQZ4xSpxJUd8MXnFj3yNfpAhpR/UgR9mZDj+t3z1Rvd30Hnl/cE4VU26Y8vpgN/Yq8mfLv7Iwl2seW2n2LhbSuPfpUJtQW6GD6sI/vws7j9pJt7iZlWuIlUOttbIo0KnW0DQROT3zPb1/h7QcFfYKXTWESJqj1kBSe/0ES/f3CeCDwImnkSaG6WviPv1dQlShGp0rvusEvhXsCeJlE/wC+Me7LpCxzMGWl23dbKuhuKbyO0VLhkxJKp7/tXdwCB6T5/MASnnH0pvZ9NcEvbjkhFRRNJyUZpw+F7fvuU1ukkjCV3T3JdrOcU1MTYPsWKdrBIZPzjikoL2VpGNFUlfK8z8SoE9qyYdYzGlGWhr4iZh3DcyWhD1tBCnopa4gPRDloIxpqRTozF7/gBSgDtcO4dOU/KVXhKyUgZaHwUmA6+V2tc6t41LkbtSIFvb5fEarXaJHKKdvp+/BfUJi1n6Sg0H3o9sf/AyWN2u7V4g0AvBGFvBJU1+04/WvMs6iXB63eofSZEzecEsOHw+WhYUiZy8EtLrB7K1hKKa1BP4p5gaHhnVyofuxhsVFRrgK7Wx5qUcpqO9iIF0FpheHbyc7FHgVknVBQlnLXLX44qwZ1oOusFANia4bD8XxL9UNPFayV9fbjzXQlAwgrQY+HcYMGKwtOR+BET5Kl6BentUusHl+GCkQvBYUudY4soMdpULHC70GlfSlDQxoszf0upeOiHFy9Dl8ROysfQRJNvgplA06qyJarLoXes6QFmkNbfJPSKPQrQSEFbbDE0EU97Q8bVGlYESo+riRdRFmdzKEQPbQSaI1UUhqqCPECarNhMrdZXM3Sl2KSLmR8CUp9UC4NcoOua5YKlNuP/AUUei7fHI1hbK5PcSmo0uoP3C4dgqvs58byXC8L7Y+WoRatQY93TSUYuiwTKlLQzR5Zgu5gtd10TEfar9gAreyk+CKmKQM4WbE0aITj1enfjGLXbf3OE7O+Sm1PuAId8add/jz1VoUTKmI29LiUbT8HSsakN0iX+rkyVrsDUuB5EzTnDbwuC9kfqhEK6Als8zyoXjHtKFK8gdsMnQwoymKo/lbJ6FcxfDrICH67WTB8XU0W8fympQYH91WENtiIcEimfh67KnSRtuuDQi8msGaoWeuHQi9YP9Ri0UOXV4UW+DBZL9iwKtSd7SuC0ohXhO7JPTlwLWp836EVE54D3UDM8Sh1Q9PrkiCvw484E+qeFO1sqCram6aGY4+ULTy3BP0JSmfA856T07sAAAAASUVORK5CYII=);
                            background-repeat: no-repeat;
                            background-position: center center;
                            background-size: cover;
                        "
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
                        style="
                            background-image: url(data:image/png;base64,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);
                            background-repeat: no-repeat;
                            background-position: center center;
                            background-size: cover;
                        "
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
                        style="
                            background-image: url(data:image/png;base64,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);
                            background-repeat: no-repeat;
                            background-position: center center;
                            background-size: cover;
                        "
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
