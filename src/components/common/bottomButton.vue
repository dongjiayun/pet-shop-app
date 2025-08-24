<script setup lang="ts">
import SubmitButton from "@/components/common/submitButton.vue";

const props = defineProps({
    label: {
        type: String,
        default: "修改",
    },
});

const handleSubmit = () => {
    emit("submit");
};

const emit = defineEmits(["submit"]);
</script>

<template>
    <view class="bottom-button">
        <submit-button @click="handleSubmit">{{ props.label }}</submit-button>
    </view>
</template>

<style scoped lang="scss">
.bottom-button {
    height: 166rpx;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffecf5;
    z-index: 100;
    padding: 32rpx;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}
</style>
