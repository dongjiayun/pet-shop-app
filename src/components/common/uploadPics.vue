<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false,
    },
});

const lists = ref([]);

const handleChooseImage = () => {
    emit("chooseImage", 9 - lists.value.length);
};

const uploadPics = (pics) => {
    lists.value = pics;
};

const handleDelete = (key) => {
    lists.value.splice(key, 1);
    emit("updatePics", 9 - lists.value.length);
};

const handlePreview = (key) => {
    console.log(key);
    uni.previewImage({
        urls: lists.value,
        current: key,
    });
};

const emit = defineEmits(["chooseImage", "updatePics"]);

defineExpose({ uploadPics });
</script>

<template>
    <view class="upload-pics">
        <view class="upload-pics-list">
            <view v-for="(item, key) in lists" :key="key" class="upload-pics-list-item">
                <image
                    class="upload-pics-list-item-image"
                    @click="handlePreview(key)"
                    :src="item"
                ></image>
                <image
                    v-if="isEdit"
                    class="upload-pics-list-item-delete"
                    src="@/assets/icons/delete.png"
                    @click="handleDelete(key)"
                ></image>
            </view>
            <view v-if="lists.length === 0 && !isEdit" class="upload-pics-list-item">-</view>
            <view
                v-if="lists.length < 9 && isEdit"
                class="upload-pics-add"
                @click="handleChooseImage"
            >
                <image class="upload-pics-add-icon" src="@/assets/icons/camera.png"></image>
                <view class="upload-pics-add-text">添加图片</view>
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.upload-pics {
    display: flex;
    align-items: center;
    &-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        &-item {
            position: relative;
            width: 120rpx;
            height: 120rpx;
            margin-right: 20rpx;
            border-radius: 8rpx;
            margin-bottom: 20rpx;
            &-image {
                width: 120rpx;
                height: 120rpx;
                border-radius: 8rpx;
            }
            &-delete {
                position: absolute;
                top: -12rpx;
                right: -12rpx;
                width: 24rpx;
                height: 24rpx;
            }
        }
    }
    &-add {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1rpx dashed #e3d1cc;
        border-radius: 8rpx;
        width: 120rpx;
        height: 120rpx;
        justify-content: center;
        margin-bottom: 20rpx;
        &-icon {
            width: 36rpx;
            height: 36rpx;
        }
        &-text {
            font-family: PingFang SC;
            font-weight: 400;
            font-style: Regular;
            font-size: 20rpx;
            leading-trim: NONE;
            line-height: 220.00000000000003%;
            letter-spacing: 0%;
            vertical-align: middle;
            color: #402b2c;
        }
    }
}
</style>
