<script setup lang="ts">
import PetContainer from "@/components/common/petContainer.vue";
import { ref, onMounted } from "vue";
import DatePopup from "@/components/common/datePopup.vue";
import PetPopup from "@/components/common/petPopup.vue";
import PetBreedPopup from "@/components/common/petBreedPopup.vue";
import dayjs from "dayjs";
import { PetModel } from "@/api";
import { onLoad } from "@dcloudio/uni-app";
import { getDictNameById } from "@/utils";
import { useAppStore } from "@/stores/app";

const petId = ref();

const isHistory = ref(false);

onLoad((props) => {
    petId.value = props.petId;
    isHistory.value = props.isHistory;
});

const isEdit = ref(false);

const formRef = ref();

const genderPopup = ref();

const datePopup = ref();

const typePopup = ref();

const breedPopup = ref();

const rules = {};

const formData = ref({
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

const form = ref({
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

const getPetDetail = () => {
    if (isHistory.value) {
        const store = useAppStore();
        form.value = {
            nickname: store.historyCache?.nickName || "",
            gender: store.historyCache?.gender
                ? getDictNameById(dicts.gender, store.historyCache.gender)
                : "",
            birthday: store.historyCache?.birthday || "",
            weight: store.historyCache?.weight || "",
            breed: store.historyCache?.breed?.name || "",
            type: store.historyCache?.type
                ? getDictNameById(dicts.type, store.historyCache.type)
                : "",
            diagnosisHistory: store.historyCache?.diagnosisHistory || "",
            forbiden: store.historyCache?.forbiden || false,
            isSterilized: store.historyCache?.isSterilized || false,
            aggressive: store.historyCache?.aggressive || false,
            remark: store.historyCache?.remark || "",
        };
        return;
    }
    PetModel.getPetDetail(petId.value).then((res) => {
        if (res.status !== 0) {
            uni.showToast({
                title: res.message,
                icon: "none",
            });
            return Promise.reject(new Error(res.message));
        }
        formData.value = res.data;
        form.value = {
            nickname: res.data.nickName,
            gender: getDictNameById(dicts.gender, res.data.gender),
            birthday: res.data.birthday,
            weight: res.data.weight,
            breed: res.data.breed.name,
            type: getDictNameById(dicts.type, res.data.type),
            diagnosisHistory: res.data.diagnosisHistory,
            forbiden: res.data.forbiden,
            isSterilized: res.data.isSterilized,
            aggressive: res.data.aggressive,
            remark: res.data.remark,
        };
    });
};

const handleGender = () => {
    if (!isEdit.value) return;
    genderPopup.value.open();
};

const handleDate = () => {
    if (!isEdit.value) return;
    datePopup.value.open();
};

const handleType = () => {
    if (!isEdit.value) return;
    typePopup.value.open();
};

const handleBreed = () => {
    if (!isEdit.value) return;
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
    form.value.breed = "";
    formData.value.breed = null;
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
    formRef.value
        .validate()
        .then(() => {
            uni.showLoading({
                title: "请稍后",
            });
            formData.value = {
                ...formData.value,
                nickname: form.value.nickname,
                birthday: form.value.birthday,
                weight: form.value.weight,
                isSterilized: form.value.isSterilized,
                aggressive: form.value.aggressive,
                remark: form.value.remark,
                diagnosisHistory: form.value.diagnosisHistory,
                forbiden: form.value.forbiden,
            };
            PetModel.updatePet(formData.value)
                .then((res) => {
                    if (res.status === 0) {
                        setTimeout(() => {
                            uni.showToast({
                                title: "修改成功",
                                icon: "none",
                            });
                        }, 500);
                        isEdit.value = false;
                        getPetDetail();
                    }
                })
                .finally(() => {
                    uni.hideLoading();
                });
        })
        .catch((e) => {
            uni.showToast({
                title: e?.[0].errorMessage,
                icon: "none",
            });
        });
};

const handleEdit = () => {
    isEdit.value = !isEdit.value;
    getPetDetail();
};

onMounted(() => {
    getPetDetail();
});
</script>

<template>
    <pet-container
        nav-bar-color="#FFFBC0"
        background-color="#FFFCE0"
        title="宠物档案"
        :bottomButtonName="isEdit ? '保存' : null"
        bottom-button-type="yellow"
        @submit="handleSubmit"
    >
        <view class="base-detail" :class="{ 'base-detail-edit': isEdit }">
            <view class="base-detail-header">
                <view class="base-detail-header-title">基本资料</view>
                <view
                    class="base-detail-header-edit"
                    v-if="!isEdit && !isHistory"
                    @click="handleEdit"
                >
                    <image
                        class="base-detail-header-edit-icon"
                        src="@/assets/icons/edit_1.png"
                    ></image>
                    <view class="base-detail-header-edit-text">编辑</view>
                </view>
                <view @click="handleEdit" v-else-if="!isHistory">
                    <view class="base-detail-header-edit-text">取消</view>
                </view>
            </view>
            <view class="base-detail-content pet-input">
                <uni-forms
                    ref="formRef"
                    :modelValue="form"
                    :rules="rules"
                    label-position="top"
                    label-width="200"
                >
                    <uni-forms-item label="宠物昵称" name="nickname">
                        <uni-easyinput
                            :inputBorder="false"
                            type="text"
                            v-model="form.nickname"
                            :disabled="!isEdit"
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
                                validateTrigger="blur"
                            />
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="体重(kg)" name="weight">
                        <uni-easyinput
                            :inputBorder="false"
                            type="number"
                            v-model="form.weight"
                            :disabled="!isEdit"
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
                                placeholder="请选择品种"
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
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入疾病史' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="禁忌点 (客户相关要求备注尽量都填在这里)" name="forbiden">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.forbiden"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入禁忌点' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item name="isSterilized">
                        <view class="pet-form-item">
                            <view class="pet-form-item-label">是否绝育</view>
                            <uni-data-checkbox
                                :disabled="!isEdit"
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
                                :disabled="!isEdit"
                                v-model="form.aggressive"
                                :localdata="reverseDict(dicts.aggressive)"
                                selectedColor="#FF7391"
                                selectedTextColor="#FF7391"
                            ></uni-data-checkbox>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item
                        label="备注 (品种如选'其他',此空仅填品种,此外勿填)"
                        name="forbiden"
                    >
                        <uni-easyinput
                            :disabled="!isEdit"
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.remark"
                            :placeholder="isEdit ? '请输入备注' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                </uni-forms>
            </view>
        </view>
    </pet-container>
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
        :type="formData.type"
        ref="breedPopup"
        @submit="handleChooseBreed"
    ></pet-breed-popup>
</template>

<style scoped lang="scss">
@use "@/styles/customUniUi.scss";
.base-detail {
    padding: 0 32rpx;
    &-edit {
        padding-bottom: 200rpx;
    }
    &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 48rpx;
        &-title {
            font-family: PingFang SC;
            font-weight: 500;
            font-style: Medium;
            font-size: 36rpx;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
            color: #402b2c;
        }
        &-edit {
            display: flex;
            align-items: center;
            &-icon {
                width: 28rpx;
                height: 28rpx;
                margin-right: 8rpx;
            }
            &-text {
                font-family: PingFang SC;
                font-weight: 400;
                font-style: Regular;
                font-size: 28rpx;
                leading-trim: NONE;
                line-height: 100%;
                letter-spacing: 0%;
                color: #402b2c;
            }
        }
    }
}
</style>
