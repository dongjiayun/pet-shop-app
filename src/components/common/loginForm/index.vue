<!-- 账号密码登录页 -->
<template>
    <view class="uni-content login-container">
        <slot name="prefix"></slot>

        <uni-forms ref="formRef" :rules="rules" :modelValue="form" validate-trigger="blur">
            <uni-forms-item name="username">
                <uni-easyinput
                    primary-color="#FF7391"
                    placeholderStyle="color: #FFC8D2"
                    :focus="true"
                    clearable
                    v-model="form.username"
                    placeholder="邮箱"
                    :styles="inputStyles"
                />
            </uni-forms-item>
            <uni-forms-item name="password">
                <uni-easyinput
                    primary-color="#FF7391"
                    placeholderStyle="color: #FFC8D2"
                    clearable
                    type="password"
                    v-model="form.password"
                    placeholder="请输入密码"
                    :styles="inputStyles"
                />
            </uni-forms-item>
        </uni-forms>
        <slot name="captcha"></slot>

        <button class="uni-btn" @click="login" :disabled="!form.username || !form.password">
            登 录
        </button>
        <!-- 忘记密码 -->
        <view class="link-box">
            <view v-if="forget">
                <text class="forget">忘记了？</text>
                <text class="link" @click="forgetPwd">找回密码</text>
            </view>
            <text class="link" @click="toReg" v-if="reg">注册账号</text>
            <text class="link" @click="toReset" v-if="reg">重置密码</text>
        </view>
        <br />
        <view v-if="more">
            <center @click="moreLogin">更多登录方式</center>
        </view>
        <slot name="suffix"></slot>
        <br />
    </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const form = ref({
    username: "",
    password: "",
});

const formRef = ref();

const rules = ref({
    username: {
        rules: [
            {
                required: true,
                errorMessage: "请输入邮箱",
            },
            {
                format: "email",
                errorMessage: "邮箱格式不正确",
            },
        ],
    },
    password: {
        rules: [
            {
                required: true,
                errorMessage: "请输入密码",
            },
        ],
    },
});

const inputStyles = {
    color: "#FF7391",
};

const props = defineProps({
    more: {
        type: Boolean,
        defalut: false,
    },
    forget: {
        type: Boolean,
        default: false,
    },
    reg: {
        type: Boolean,
        default: true,
    },
});

const login = () => {
    formRef.value.validate().then((res) => {
        emit("login", form.value);
    });
};

const forgetPwd = () => {
    emit("forgetPwd");
};

const toReg = () => {
    emit("toReg");
};

const moreLogin = () => {
    emit("moreLogin");
};

const toReset = () => {
    emit("toResetPassword");
};

const emit = defineEmits(["login", "forgetPwd", "toReg", "moreLogin"]);
</script>

<style lang="scss" scoped>
@use "./index.scss";

@media screen and (min-width: 690px) {
    .uni-content {
        height: auto;
    }
}

.login-container {
    padding: 40rpx 20rpx 0;
}

.forget {
    font-size: 12px;
    color: #8a8f8b;
}

.link-box {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
}

.link {
    font-size: 12px;
}
</style>
