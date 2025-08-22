<script setup lang="ts">
import homeContainer from "@/components/pages/homeContainer.vue";
import resetPasswordForm from "@/components/common/resetPasswordForm/index.vue";
import { AuthModel } from "@/api";
import { redirectTo } from "@/router/router";

const handleResetPassword = (form: any) => {
    AuthModel.resetPasswordByOtp({
        email: form.email,
        password: form.password,
        otp: form.otp,
        ticket: form.ticket,
    }).then((data) => {
        if (data.status === 0) {
            uni.showToast({ title: "重置密码成功", icon: "none" });
            redirectTo({
                name: "signin",
            });
        }
    });
};
</script>

<template>
    <home-container class="home">
        <view class="container">
            <reset-password-form @submit="handleResetPassword"></reset-password-form>
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
