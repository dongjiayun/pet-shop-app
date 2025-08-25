<script setup lang="ts">
import { onMounted, ref } from "vue";
const popup = ref();

const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    list: {
        type: Array,
        default: () => [],
    },
    defaultChoise: [String, Number],
});

const handleChoose = (id) => {
    currentChoise.value = id;
    emit("submit", id);
};

const open = () => {
    popup.value.open();
};

const close = () => {
    popup.value.close();
};

const currentChoise = ref();

onMounted(() => {
    if (props.defaultChoise) {
        currentChoise.value = props.defaultChoise;
    }
});

const emit = defineEmits(["submit"]);

defineExpose({ open, close });
</script>

<template>
    <uni-popup type="bottom" ref="popup" safeArea>
        <view class="pet-popup">
            <view class="pet-popup-title"> {{ title }} </view>
            <image
                @click="popup.close()"
                class="pet-popup-close"
                src="@/assets/icons/close.png"
            ></image>
            <view class="pet-popup-list">
                <view
                    class="pet-popup-list-item"
                    :class="{ active: currentChoise === item.id }"
                    v-for="item in list"
                    :key="item.id"
                    @click="handleChoose(item.id)"
                    >{{ item.name }}
                </view>
            </view>
            <view class="pet-popup-submit">确定</view>
        </view>
    </uni-popup>
</template>

<style scoped lang="scss">
.pet-popup {
    position: relative;
    z-index: 200;
    background: #fff;
    border-radius: 70rpx;
    margin: 20rpx;
    padding: 48rpx 20rpx 84rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-close {
        position: absolute;
        top: 40rpx;
        right: 40rpx;
        width: 40rpx;
        height: 40rpx;
    }
    &-title {
        font-family: PingFang SC;
        font-weight: 500;
        font-style: Medium;
        font-size: 32rpx;
        leading-trim: NONE;
        line-height: 100%;
        letter-spacing: 0%;
        text-align: center;
        color: #402b2c;
        margin-bottom: 60rpx;
    }
    &-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: column;
        &-item {
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: PingFang SC;
            font-weight: 500;
            font-style: Medium;
            font-size: 14px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: center;
            vertical-align: middle;
            border-radius: 10rpx;
            width: 600rpx;
            margin-bottom: 20rpx;
            height: 80rpx;
            &.active {
                background: #ffe3f1;
                color: #fd409e;
            }
        }
    }
    &-submit {
        width: 600rpx;
        line-height: 84rpx;
        text-align: center;
        font-family: PingFang SC;
        font-weight: 600;
        font-style: Semibold;
        font-size: 32rpx;
        leading-trim: NONE;
        line-height: 44rpx;
        letter-spacing: 0%;
        text-align: center;

        background: #ff9ece;
        border-radius: 64rpx;
        color: #fff;

        box-shadow: 0px 6px 12.6px 0px #ff7eda4d;

        padding: 26rpx;
    }
}
</style>
