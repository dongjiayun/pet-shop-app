<script setup lang="ts">
import petNavbar from "../common/petNavbar.vue";
import bottomButton from "@/components/common/bottomButton.vue";
import { onMounted, ref } from "vue";
const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    navBarColor: {
        type: String,
        default: "",
    },
    backgroundColor: {
        type: String,
        default: "",
    },
    bottomButtonName: String,
    bottomButtonType: {
        type: String,
        default: "pick",
    },
});

const visible = ref(false);

onMounted(() => {
    visible.value = true;
});

const emit = defineEmits(["submit"]);

const handleSubmit = () => {
    emit("submit");
};
</script>

<template>
    <view class="pet-container">
        <pet-navbar :title="props.title" :navBarColor="props.navBarColor"></pet-navbar>
        <view class="pet-container-main" :class="{ active: visible }">
            <slot></slot>
        </view>
        <bottom-button
            v-if="props.bottomButtonName"
            :label="props.bottomButtonName"
            :type="props.bottomButtonType"
            @submit="handleSubmit"
        ></bottom-button>
    </view>
</template>

<style lang="scss" scoped>
.pet-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: v-bind(backgroundColor);
    &-main {
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.5s ease-out;
        width: 750rpx;
        padding: 40rpx;
        &.active {
            opacity: 1;
            transform: translateY(0);
        }
    }
}
</style>
