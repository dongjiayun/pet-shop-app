<!-- 验证码登录页 -->
<template>
    <view class="uni-content login-container">
        <slot name="prefix"></slot>

        <uni-forms ref="formRef" :rules="rules" :modelValue="form" validate-trigger="blur">
            <!-- 账号输入 -->
            <uni-forms-item name="account">
                <uni-easyinput
                    primary-color="#FF7391"
                    placeholderStyle="color: #FFC8D2"
                    :focus="true"
                    clearable
                    v-model="form.account"
                    :placeholder="accountPlaceholder"
                    :styles="inputStyles"
                />
            </uni-forms-item>

            <uni-forms-item name="password">
                <uni-easyinput
                    primary-color="#FF7391"
                    placeholderStyle="color: #FFC8D2"
                    :focus="true"
                    clearable
                    type="password"
                    v-model="form.password"
                    placeholder="请输入密码"
                    :styles="inputStyles"
                />
            </uni-forms-item>

            <!-- 验证码输入区域 -->
            <uni-forms-item name="code">
                <view class="code-input-container">
                    <uni-easyinput
                        primary-color="#FF7391"
                        placeholderStyle="color: #FFC8D2"
                        clearable
                        v-model="form.code"
                        placeholder="请输入验证码"
                        :styles="{ ...inputStyles, flex: 1 }"
                    />
                    <button
                        class="send-code-btn"
                        :disabled="isCounting"
                        @click="sendVerificationCode"
                    >
                        {{ countdown > 0 ? `${countdown}s后重发` : "获取验证码" }}
                    </button>
                </view>
            </uni-forms-item>
        </uni-forms>
        <slot name="captcha"></slot>

        <button class="uni-btn" @click="handleSubmit">重置密码</button>

        <slot name="suffix"></slot>
    </view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { AuthModel } from "@/api";

// 表单数据
const form = ref({
    account: "", // 手机号/邮箱
    password: "",
    code: "", // 验证码
});

const ticket = ref("");

const formRef = ref();

// 表单验证规则
const rules = ref({
    account: {
        rules: [
            {
                required: true,
                errorMessage: "请输入手机号/邮箱",
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
            {
                validateFunction: (rule, value, data, callback) => {
                    return new Promise((resolve, reject) => {
                        if (
                            !/^[a-zA-Z0-9]+[a-zA-Z0-9!@#$%^&*()_+{}|:;"'<>,.?/~`]{6,20}$/.test(
                                value
                            )
                        ) {
                            return reject(
                                new Error("密码必须包含字母、数字、特殊字符，且长度为6~20")
                            );
                        }
                        return resolve(true);
                    });
                },
            },
        ],
    },
    code: {
        rules: [
            {
                required: true,
                errorMessage: "请输入验证码",
            },
        ],
    },
});

// 倒计时状态
const countdown = ref(0);
const isCounting = computed(() => countdown.value > 0);

// 配置参数
const props = defineProps({
    accountType: {
        type: String, // 'phone' 或 'email'
        default: "email",
    },
    showPwdLogin: {
        type: Boolean,
        default: true,
    },
    showReg: {
        type: Boolean,
        default: true,
    },
});

// 根据账号类型动态提示
const accountPlaceholder = computed(() => (props.accountType === "phone" ? "手机号" : "邮箱"));

// 发送验证码逻辑（留空待实现）
const sendVerificationCode = async () => {
    if (!form.value.account) {
        uni.showToast({ title: "请先输入邮箱", icon: "none" });
        return;
    }

    // 启动倒计时
    startCountdown(60);

    AuthModel.sendResetEmailOtp({
        email: form.value.account,
    }).then((data) => {
        if (data.status === 0) {
            ticket.value = data.data;
        } else {
            uni.showToast({ title: data.message, icon: "none" });
        }
    });
};

// 倒计时控制
const startCountdown = (seconds: number) => {
    countdown.value = seconds;
    const timer = setInterval(() => {
        if (countdown.value <= 0) {
            clearInterval(timer);
            return;
        }
        countdown.value--;
    }, 1000);
};

// 登录验证
const handleSubmit = () => {
    formRef.value.validate().then(() => {
        emit("submit", {
            email: form.value.account,
            password: form.value.password,
            otp: form.value.code,
            ticket: ticket.value,
        });
    });
};

// 事件通信
const emit = defineEmits(["submit"]);
</script>

<style lang="scss" scoped>
@import "./index.scss";
/* 保留原始样式基础上新增 */
.login-container {
    padding: 40rpx 20rpx 0;
}

.code-input-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.send-code-btn {
    height: 70rpx;
    min-width: 180rpx;
    line-height: 70rpx;
    font-size: 12px;
    background-color: #f5f5f5;
    color: #ff7391;
    border-radius: 8rpx;

    &[disabled] {
        background-color: #eee;
        color: #999;
    }
}

.link-box {
    display: flex;
    justify-content: space-between;
    margin-top: 30rpx;
    padding: 0 20rpx;
}

.link {
    font-size: 12px;
    color: #ff7391;
    text-decoration: underline;
}
</style>
