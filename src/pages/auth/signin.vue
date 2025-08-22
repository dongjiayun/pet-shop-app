<script setup lang="ts">
import homeContainer from "@/components/pages/homeContainer.vue";
import loginFrom from "@/components/common/loginForm/index.vue";
import { useUserStore } from "@/stores/user";
import { push } from "@/router/router";

const store = useUserStore();

const handleLogin = (form: any) => {
    store.login({
        loginType: "emailWithPassword",
        email: form.username,
        password: form.password,
    });
};

const handleResetPassword = () => {
    push({
        name: "resetPassword",
    });
};

const handleSignup = () => {
    push({
        name: "signup",
    });
};
</script>

<template>
    <home-container class="home">
        <view class="container">
            <login-from
                @login="handleLogin"
                @to-reg="handleSignup"
                @to-reset-password="handleResetPassword"
            ></login-from>
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
