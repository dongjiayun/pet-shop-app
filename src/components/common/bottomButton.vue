<script setup lang="ts">
import SubmitButton from "@/components/common/submitButton.vue";

const props = defineProps({
    label: {
        type: String,
        default: "修改",
    },
    type: {
        type: String,
        default: "pink",
    },
});

const handleSubmit = () => {
    emit("submit");
};

const emit = defineEmits(["submit"]);
</script>

<template>
    <view class="bottom-button" :class="props.type">
        <submit-button @click="handleSubmit" :type="props.type">{{ props.label }}</submit-button>
    </view>
</template>

<style scoped lang="scss">
.bottom-button {
    height: 166rpx;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    padding: 32rpx;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    &.pink {
        background-color: #ffecf5;
    }
    &.red {
        background-color: #fffbfa;
    }
    &.blue {
        background-color: #e8f9ff;
    }
    &.yellow {
        background-color: #fffce0;
    }
}
</style>
