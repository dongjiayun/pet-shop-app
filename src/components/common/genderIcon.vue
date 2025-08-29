<script setup lang="ts">
const props = defineProps({
    gender: {
        type: String,
        default: "male",
    },
    isBg: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <view class="gender-icon" :class="{ [gender]: true, isBg }">
        {{ gender === "male" ? "♂ 弟弟" : "♀ 妹妹" }}
    </view>
</template>

<style scoped lang="scss">
.gender-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 28rpx;
    padding: 4rpx 10rpx;
    &.male {
        color: #1e9dff;
        &.isBg {
            background-color: #e4f3ff;
        }
    }
    &.female {
        color: #ff3ec9;
        &.isBg {
            background-color: #ffe1f7;
        }
    }
}
</style>
