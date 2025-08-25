<script setup lang="ts">
const props = defineProps({
    image: {
        type: String,
        default: "/static/icons/pet_avatar.png",
    },
});
</script>

<template>
    <view class="pet-avatar">
        <image class="pet-avatar-image" :src="props.image"></image>
        <view class="pet-avatar-edit">
            <image class="pet-avatar-edit-icon" src="@/assets/icons/edit.png"></image>
        </view>
    </view>
</template>

<style scoped lang="scss">
.pet-avatar {
    position: relative;
    &-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 50%;
    }
    &-edit {
        position: absolute;
        bottom: 0rpx;
        right: -20rpx;
        border-radius: 50%;
        background-color: #fff;
        border: 4rpx solid #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        &-icon {
            width: 72rpx;
            height: 72rpx;
        }
    }
}
</style>
