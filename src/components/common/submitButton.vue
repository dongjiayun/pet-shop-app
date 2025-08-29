<script setup lang="ts">
const props = defineProps({
    type: {
        type: String,
        default: "pink",
    },
});
</script>

<template>
    <view class="submit-button" :class="props.type" @click="$emit('click')">
        <slot></slot>
    </view>
</template>

<style scoped lang="scss">
.submit-button {
    height: 100rpx;
    border-radius: 32rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFang SC;
    font-weight: 500;
    font-style: Medium;
    font-size: 32rpx;
    leading-trim: NONE;
    line-height: 135%;
    letter-spacing: 0%;
    text-align: center;
    &.pink {
        background-color: #ff9ece;
        color: #fff;
    }
    &.red {
        background-color: #ff7391;
        color: #fff;
    }
    &.blue {
        background-color: #96e4ff;
        color: #402b2c;
    }
    &.yellow {
        background-color: #fceb00;
        color: #402b2c;
    }
}
</style>
