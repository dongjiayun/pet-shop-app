<script setup lang="ts">
import PetContainer from "@/components/common/petContainer.vue";
import { ref, onMounted } from "vue";
import { PetWashRecordModel, UploadModel } from "@/api";
import { onLoad } from "@dcloudio/uni-app";
import uploadPics from "@/components/common/uploadPics.vue";
import imageUploadPopup from "@/components/common/imageUploadPopup.vue";
import { baseUrl } from "@/config";
import { useAppStore } from "@/stores/app";

const isHistory = ref(false);

const petId = ref();

const uploadPicsRef = ref();

const uploadPicsPopupRef = ref();

const isCreate = ref(false);

onLoad((props) => {
    petId.value = props.petId;
    isHistory.value = props.isHistory;
});

const isEdit = ref(false);

const formRef = ref();

const rules = {};

const form = ref({
    petId: "",
    aggressive: "",
    isNeedRestriction: "",
    shapooProportion: "",
    specialRequirement: "",
    beautyRequirement: "",
    others: "",
    attachments: [],
});

const dicts = {
    isNeedRestriction: [
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
        form.value = store.historyCache;
        uploadPicsRef.value.uploadPics(form.value.attachments);
        return;
    }
    PetWashRecordModel.getPetWashRecord(petId.value).then((res) => {
        if (res.status !== 0) {
            uni.showToast({
                title: res.message,
                icon: "none",
            });
            return Promise.reject(new Error(res.message));
        }
        if (!res.data) {
            isCreate.value = true;
            isEdit.value = true;
        } else {
            isCreate.value = false;
            form.value = res.data;
            uploadPicsRef.value.uploadPics(form.value.attachments);
        }
    });
};

const reverseDict = (dict) => {
    return dict.map((item) => {
        return { value: item.id, text: item.name };
    });
};

const handleSubmit = () => {
    formRef.value
        .validate()
        .then(async () => {
            uni.showLoading({
                title: "请稍后",
            });
            if (!Array.isArray(form.value.attachments)) {
                form.value.attachments = [];
            }
            const uploadLists = form.value.attachments.map((item: string) => {
                return new Promise((resolve) => {
                    if (item.includes(baseUrl)) {
                        resolve(item);
                    } else {
                        UploadModel.uploadPic({
                            file: item,
                        }).then((res) => {
                            resolve(baseUrl + res.data);
                        });
                    }
                });
            });
            let attachments = [];
            await Promise.all(uploadLists).then((res) => {
                attachments = res || [];
            });
            form.value.attachments = attachments || [];
            form.value.petId = petId.value;
            if (isCreate.value) {
                PetWashRecordModel.createPetWashRecord(form.value)
                    .then((res) => {
                        if (res.status === 0) {
                            setTimeout(() => {
                                uni.showToast({
                                    title: "创建成功",
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
            } else {
                PetWashRecordModel.updatePetWashRecord(form.value)
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
            }
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

const handleChooseImage = () => {
    uploadPicsPopupRef.value.open();
};

const handleSubmitChooseImage = (files) => {
    form.value.attachments = files;
    uploadPicsRef.value.uploadPics(files);
};

const handleUpdatePics = (files) => {
    form.value.attachments = files;
};

onMounted(() => {
    getPetDetail();
});
</script>

<template>
    <pet-container
        nav-bar-color="#D3F4FF"
        background-color="#E8F9FF"
        title="洗护美容档案"
        :bottomButtonName="isEdit ? '保存' : null"
        bottom-button-type="blue"
        @submit="handleSubmit"
    >
        <view class="base-detail" :class="{ 'base-detail-edit': isEdit }">
            <view class="base-detail-header">
                <view class="base-detail-header-title">洗护美容档案</view>
                <template v-if="!isCreate">
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
                </template>
            </view>
            <view class="base-detail-content pet-input">
                <uni-forms
                    ref="formRef"
                    :modelValue="form"
                    :rules="rules"
                    label-position="top"
                    label-width="200"
                >
                    <uni-forms-item name="aggressive">
                        <view class="pet-form-item">
                            <view class="pet-form-item-label">存在攻击或应激行为</view>
                            <uni-data-checkbox
                                :disabled="!isEdit"
                                v-model="form.aggressive"
                                :localdata="reverseDict(dicts.aggressive)"
                                selectedColor="#FF7391"
                                selectedTextColor="#FF7391"
                            ></uni-data-checkbox>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item name="isNeedRestriction">
                        <view class="pet-form-item">
                            <view class="pet-form-item-label">是否需要携带头套和嘴套</view>
                            <uni-data-checkbox
                                :disabled="!isEdit"
                                v-model="form.isNeedRestriction"
                                :localdata="reverseDict(dicts.isNeedRestriction)"
                                selectedColor="#FF7391"
                                selectedTextColor="#FF7391"
                            ></uni-data-checkbox>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="洗护香波配比" name="shapooProportion">
                        <uni-easyinput
                            :inputBorder="false"
                            type="text"
                            v-model="form.shapooProportion"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入洗护香波配比' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="洗护注意事项或特殊要求" name="specialRequirement">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.specialRequirement"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入洗护注意事项或特殊要求' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="美容要求" name="beautyRequirement">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.beautyRequirement"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入美容要求' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="附件" name="others">
                        <upload-pics
                            ref="uploadPicsRef"
                            :isEdit="isEdit"
                            :list="form.attachments"
                            @choose-image="handleChooseImage"
                            @update-pics="handleUpdatePics"
                        ></upload-pics>
                    </uni-forms-item>
                </uni-forms>
            </view>
        </view>
    </pet-container>
    <image-upload-popup
        :imageCount="9 - (form.attachments?.length || 0)"
        ref="uploadPicsPopupRef"
        @submit="handleSubmitChooseImage"
    ></image-upload-popup>
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
