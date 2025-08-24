<script setup lang="ts">
import petContainer from "@/components/common/petContainer.vue";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { UserModel } from "@/api";

const userStore = useUserStore();

const form = ref({
    nickname: userStore.username,
});

const formRef = ref();

const rules = ref({
    nickname: {
        rules: [
            {
                required: true,
                errorMessage: "请输入昵称",
            },
        ],
    },
});

const handleSubmit = () => {
    console.log("form", form.value);
    formRef.value.validate().then(() => {
        UserModel.updateUserInfo({
            username: form.value.nickname,
        }).then((res) => {
            if (res.status !== 0) {
                uni.showToast({
                    title: res.message,
                    icon: "none",
                });
                Promise.reject(new Error(res.message));
            } else {
                uni.showToast({
                    title: "修改成功",
                });
                userStore.setUserInfo(res.data);
            }
        });
    });
};
</script>

<template>
    <pet-container
        class="mine"
        title="修改昵称"
        navBarColor="#FFF5F8"
        backgroundColor="#FFF5F8"
        bottomButtonName="保存"
        @submit="handleSubmit"
    >
        <view class="container pet-input">
            <uni-forms ref="formRef" :modelValue="form" :rules="rules">
                <uni-forms-item name="nickname">
                    <uni-easyinput
                        :inputBorder="false"
                        type="text"
                        placeholder="请输入昵称"
                        primaryColor="#0000001A"
                        validateTrigger="blur"
                        v-model="form.nickname"
                    />
                </uni-forms-item>
            </uni-forms>
        </view>
    </pet-container>
</template>

<style lang="scss" scoped>
@use "@/styles/customUniUi.scss";
.container {
    padding: 40rpx 32rpx;
}
</style>
