<script setup lang="ts">
import homeContainer from "@/components/pages/homeContainer.vue";
import signupForm from "@/components/common/signupForm/index.vue";
import { useUserStore } from "@/stores/user";

const store = useUserStore();

const handleSignup = (form) => {
    store.login({
        ...form,
        loginType: "signup",
    });
};
</script>

<template>
    <home-container class="home">
        <view class="container">
            <signup-form @submit="handleSignup"></signup-form>
        </view>
    </home-container>
</template>

<style lang="scss" scoped>
.container {
    position: relative;
    border-radius: 20rpx;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 30rpx;
}
</style>
