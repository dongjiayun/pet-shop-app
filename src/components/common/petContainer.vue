<script setup lang="ts">
import petNavbar from "../common/petNavbar.vue";
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
});

const visible = ref(false);

onMounted(() => {
    visible.value = true;
});
</script>

<template>
    <view class="container">
        <pet-navbar :title="props.title" :navBarColor="props.navBarColor"></pet-navbar>
        <view class="container-main" :class="{ active: visible }">
            <slot></slot>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.container {
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
        &.active {
            opacity: 1;
            transform: translateY(0);
        }
    }
}
</style>
