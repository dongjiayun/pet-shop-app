<script setup lang="ts">
import PetContainer from "@/components/common/petContainer.vue";
import avatar from "./components/avatar.vue";
import imageUploadPopup from "@/components/common/imageUploadPopup.vue";
import { ref } from "vue";

const popup = ref();

const handleEdit = () => {
    popup.value.open();
};

const handleChooseImage = (files) => {
    tempImage.value = files?.[0];
};

const tempImage = ref();
</script>

<template>
    <pet-container title="宠物档案录入" bottomButtonName="保存" bottom-button-type="red">
        <view class="container">
            <view class="profile" @click="handleEdit">
                <avatar :image="tempImage"></avatar>
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
@use "@/styles/customUniUi.scss";
.container {
    min-height: 100vh;
    .profile {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
