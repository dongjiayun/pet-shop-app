<script setup lang="ts">
import PetContainer from "@/components/common/petContainer.vue";
import avatar from "./components/avatar.vue";
import imageUploadPopup from "@/components/common/imageUploadPopup.vue";
import { ref } from "vue";
import PetPopup from "@/components/common/petPopup.vue";
import DatePopup from "@/components/common/datePopup.vue";
import PetBreedPopup from "@/components/common/petBreedPopup.vue";
import dayjs from "dayjs";
import { PetModel, UploadModel } from "@/api";
import { push } from "@/router/router";
import { baseUrl } from "@/config/index";

const popup = ref();

const genderPopup = ref();

const datePopup = ref();

const typePopup = ref();

const breedPopup = ref();

const formRef = ref();

const form = ref({
    avatar: "",
    customerNickname: "",
    tailNumber: "",
    nickname: "",
    gender: "",
    birthday: "",
    weight: "",
    breed: "",
    type: "",
    diagnosisHistory: "",
    forbiden: "",
    isSterilized: "",
    aggressive: "",
    remark: "",
});

const formData = ref({
    avatar: "",
    customerNickname: "",
    tailNumber: "",
    nickname: "",
    gender: "",
    birthday: "",
    weight: "",
    breed: "",
    type: "",
    diagnosisHistory: "",
    forbiden: "",
    isSterilized: "",
    aggressive: "",
    remark: "",
});

const dicts = {
    gender: [
        { id: "0", name: "弟弟" },
        { id: "1", name: "妹妹" },
    ],
    type: [
        { id: "0", name: "猫" },
        { id: "1", name: "狗" },
        { id: "2", name: "其他" },
    ],
    isSterilized: [
        { id: "0", name: "否" },
        { id: "1", name: "是" },
    ],
    aggressive: [
        { id: "0", name: "否" },
        { id: "1", name: "是" },
    ],
};

const rules = ref({
    customerNickname: {
        rules: [
            {
                required: true,
                errorMessage: "请输入客户称谓",
            },
        ],
    },
    tailNumber: {
        rules: [
            {
                required: true,
                errorMessage: "请输入客户手机尾号",
            },
            {
                validateFunction: (rule, value, data, callback) => {
                    if (!/^\d{4}$/.test(value)) {
                        return callback("请输入4位客户手机尾号");
                    }
                    return callback();
                },
            },
        ],
    },
    nickname: {
        rules: [
            {
                required: true,
                errorMessage: "请输入宠物昵称",
            },
        ],
    },
    gender: {
        rules: [
            {
                required: true,
                errorMessage: "请选择宠物性别",
            },
        ],
    },
    birthday: {
        rules: [
            {
                required: true,
                errorMessage: "请选择宠物生日",
            },
        ],
    },
    weight: {
        rules: [
            {
                required: true,
                errorMessage: "请输入宠物体重",
            },
            {
                validateFunction: (rule, value, data, callback) => {
                    if (!/^\d+(\.\d+)?$/.test(value)) {
                        return callback("请输入正确的宠物体重");
                    }
                    return callback();
                },
            },
        ],
    },
    breed: {
        rules: [
            {
                required: true,
                errorMessage: "请选择宠物品种",
            },
        ],
    },
    type: {
        rules: [
            {
                required: true,
                errorMessage: "请选择宠物类型",
            },
        ],
    },
    isSterilized: {
        rules: [
            {
                required: true,
                errorMessage: "请选择是否绝育",
            },
        ],
    },
    aggressive: {
        rules: [
            {
                required: true,
                errorMessage: "请选择是否有攻击行为",
            },
        ],
    },
    remark: {
        rules: [
            {
                validateFunction: (rule, value, data, callback) => {
                    if (form.value.type === "2") {
                        return callback("异宠请备注宠物品种");
                    }
                    return callback();
                },
            },
        ],
    },
});

const handleEditAvatar = () => {
    popup.value.open();
};

const handleChooseImage = (files) => {
    form.value.avatar = files?.[0];
};

const handleGender = () => {
    genderPopup.value.open();
};

const handleDate = () => {
    datePopup.value.open();
};

const handleType = () => {
    typePopup.value.open();
};

const handleBreed = () => {
    if (!form.value.type) {
        uni.showToast({
            title: "请先选择宠物类型",
            icon: "none",
        });
        return;
    }
    breedPopup.value.open();
};

const handleChooseGender = (_, gender) => {
    form.value.gender = gender.name;
    formData.value.gender = gender.id;
};

const handleChooseDate = (date) => {
    form.value.birthday = dayjs(date).format("YYYY-MM-DD");
};

const handleChooseType = (_, type) => {
    form.value.type = type.name;
    formData.value.type = type.id;
};

const handleChooseBreed = (breed) => {
    form.value.breed = breed.name;
    formData.value.breed = breed;
};

const reverseDict = (dict) => {
    return dict.map((item) => {
        return { value: item.id, text: item.name };
    });
};

const handleSubmit = () => {
    if (!form.value.avatar) {
        return uni.showToast({
            title: "请上传宠物头像",
            icon: "none",
        });
    }
    formRef.value.validate().then(() => {
        UploadModel.uploadPic({
            file: form.value.avatar,
        }).then((res) => {
            console.log(res, res.status, typeof res);
            if (res.status === 0) {
                form.value.avatar = baseUrl + res.data;
                formData.value = {
                    ...formData.value,
                    avatar: form.value.avatar,
                    customerNickname: form.value.customerNickname,
                    tailNumber: form.value.tailNumber,
                    nickname: form.value.nickname,
                    birthday: form.value.birthday,
                    weight: form.value.weight,
                    isSterilized: form.value.isSterilized,
                    aggressive: form.value.aggressive,
                    remark: form.value.remark,
                    diagnosisHistory: form.value.diagnosisHistory,
                    forbiden: form.value.forbiden,
                };
                PetModel.createPet(formData.value).then((res) => {
                    if (res.code === 0) {
                        uni.showToast({
                            title: "新建成功",
                            icon: "none",
                        });
                    }
                });
            } else {
                uni.showToast({
                    title: res.message,
                    icon: "none",
                });
            }
        });
    });
};
</script>

<template>
    <pet-container
        title="宠物档案录入"
        background-color="#FFFBFA"
        bottomButtonName="保存"
        bottom-button-type="red"
        @submit="handleSubmit"
    >
        <view class="container">
            <view class="profile" @click="handleEditAvatar">
                <avatar :image="form.avatar"></avatar>
                <view class="profile-label">宠物头像</view>
            </view>
            <view class="form pet-input">
                <view class="form-title">基本资料</view>
                <uni-forms ref="formRef" :modelValue="form" :rules="rules" label-position="top">
                    <uni-forms-item label="客户称谓" name="customerNickname">
                        <uni-easyinput
                            :inputBorder="false"
                            type="text"
                            v-model="form.customerNickname"
                            placeholder="请输入客户称谓"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="手机尾号" name="tailNumber">
                        <uni-easyinput
                            :inputBorder="false"
                            type="text"
                            v-model="form.tailNumber"
                            placeholder="请输入客户手机尾号后四位"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="宠物昵称" name="nickname">
                        <uni-easyinput
                            :inputBorder="false"
                            type="text"
                            v-model="form.nickname"
                            placeholder="请输入宠物昵称"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="性别" name="gender">
                        <view @click="handleGender">
                            <uni-easyinput
                                :inputBorder="false"
                                type="text"
                                disabled
                                v-model="form.gender"
                                placeholder="请选择性别"
                                primaryColor="#0000001A"
                                validateTrigger="blur"
                            />
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="生日" name="birthday">
                        <view @click="handleDate">
                            <uni-easyinput
                                :inputBorder="false"
                                type="text"
                                disabled
                                v-model="form.birthday"
                                placeholder="请选择生日"
                                primaryColor="#0000001A"
                                validateTrigger="blur"
                            />
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="体重" name="weight">
                        <uni-easyinput
                            :inputBorder="false"
                            type="number"
                            v-model="form.weight"
                            placeholder="请输入体重"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="宠物种类" name="type">
                        <view @click="handleType">
                            <uni-easyinput
                                :inputBorder="false"
                                type="text"
                                disabled
                                v-model="form.type"
                                placeholder="请选择宠物种类"
                                primaryColor="#0000001A"
                                validateTrigger="blur"
                            />
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="品种" name="breed">
                        <view @click="handleBreed">
                            <uni-easyinput
                                :inputBorder="false"
                                type="text"
                                disabled
                                v-model="form.breed"
                                placeholder="请输入品种"
                                primaryColor="#0000001A"
                                validateTrigger="blur"
                            />
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="疾病史" name="diagnosisHistory">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.diagnosisHistory"
                            placeholder="请输入疾病史"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="禁忌点" name="forbiden">
                        <uni-easyinput
                            :inputBorder="false"
                            type="text"
                            v-model="form.forbiden"
                            placeholder="请输入禁忌点"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item name="isSterilized">
                        <view class="pet-form-item">
                            <view class="pet-form-item-label">是否绝育</view>
                            <uni-data-checkbox
                                v-model="form.isSterilized"
                                :localdata="reverseDict(dicts.isSterilized)"
                                selectedColor="#FF7391"
                                selectedTextColor="#FF7391"
                            ></uni-data-checkbox>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item name="aggressive">
                        <view class="pet-form-item">
                            <view class="pet-form-item-label">是否有攻击行为</view>
                            <uni-data-checkbox
                                v-model="form.aggressive"
                                :localdata="reverseDict(dicts.aggressive)"
                                selectedColor="#FF7391"
                                selectedTextColor="#FF7391"
                            ></uni-data-checkbox>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="备注" name="forbiden">
                        <uni-easyinput
                            :inputBorder="false"
                            type="text"
                            v-model="form.remark"
                            placeholder="请输入备注"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                </uni-forms>
            </view>
        </view>
    </pet-container>
    <image-upload-popup
        ref="popup"
        :image-count="1"
        @submit="handleChooseImage"
    ></image-upload-popup>
    <pet-popup
        ref="genderPopup"
        title="性别"
        default-choise="0"
        :list="dicts.gender"
        @submit="handleChooseGender"
    ></pet-popup>
    <date-popup ref="datePopup" @submit="handleChooseDate"></date-popup>
    <pet-popup
        ref="typePopup"
        title="宠物种类"
        default-choise="0"
        :list="dicts.type"
        @submit="handleChooseType"
    ></pet-popup>
    <pet-breed-popup
        :type="formData.type?.id"
        ref="breedPopup"
        @submit="handleChooseBreed"
    ></pet-breed-popup>
</template>

<style scoped lang="scss">
@use "@/styles/customUniUi.scss";
.container {
    min-height: 100vh;
    .profile {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        &-label {
            font-family: PingFang SC;
            font-weight: 500;
            font-style: Medium;
            font-size: 32rpx;
            leading-trim: NONE;
            letter-spacing: -2%;
            text-align: center;
            margin-top: 10rpx;
        }
    }
    .form {
        margin-top: 48rpx;
        padding: 32rpx;
        margin-bottom: 200rpx;
        &-title {
            font-family: PingFang SC;
            font-weight: 500;
            font-style: Medium;
            font-size: 36rpx;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
            color: #402b2c;
            margin-bottom: 48rpx;
        }
    }
}
</style>
