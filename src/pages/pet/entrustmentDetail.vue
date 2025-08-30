<script setup lang="ts">
import PetContainer from "@/components/common/petContainer.vue";
import { ref, onMounted } from "vue";
import { PetEntrustmentModel, UploadModel } from "@/api";
import { onLoad } from "@dcloudio/uni-app";
import uploadPics from "@/components/common/uploadPics.vue";
import imageUploadPopup from "@/components/common/imageUploadPopup.vue";
import { baseUrl } from "@/config";
import { useAppStore } from "@/stores/app";

const petId = ref();

const isHistory = ref(false);

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
    habit: "",
    foodRequirement: "",
    strollRequirement: "",
    nursingRequirement: "",
    roomRequirement: "",
    interactionRequirement: "",
    cautions: "",
    specialRequirement: "",
    others: "",
    attachments: [],
});

const getPetDetail = () => {
    if (isHistory.value) {
        const store = useAppStore();
        form.value = store.historyCache;
        uploadPicsRef.value.uploadPics(form.value.attachments);
        return;
    }
    PetEntrustmentModel.getPetEntrustment(petId.value).then((res) => {
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
            form.value = res.data;
            isCreate.value = false;
            uploadPicsRef.value.uploadPics(form.value.attachments);
        }
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
                PetEntrustmentModel.createPetEntrustment(form.value)
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
                PetEntrustmentModel.updatePetEntrustment(form.value)
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
        nav-bar-color="#FFD7EB"
        background-color="#FFECF5"
        title="寄养档案"
        :bottomButtonName="isEdit ? '保存' : null"
        bottom-button-type="pink"
        @submit="handleSubmit"
    >
        <view class="base-detail" :class="{ 'base-detail-edit': isEdit }">
            <view class="base-detail-header">
                <view class="base-detail-header-title">寄养档案</view>
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
                    <uni-forms-item label="宠物性格及习惯（厕所、饮食、照顾方式习惯）" name="habit">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.habit"
                            :disabled="!isEdit"
                            :placeholder="
                                isEdit ? '请输入宠物性格及习惯（厕所、饮食、照顾方式习惯）' : '-'
                            "
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="饮食要求" name="foodRequirement">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.foodRequirement"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入饮食要求' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="遛弯要求" name="strollRequirement">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.strollRequirement"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入遛弯要求' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="护理要求" name="nursingRequirement">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.nursingRequirement"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入护理要求' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="房间布置要求" name="roomRequirement">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.roomRequirement"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入房间布置要求' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="互动要求" name="interactionRequirement">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.interactionRequirement"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入互动要求' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="警惕事项" name="cautions">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.cautions"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入警惕事项' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="特殊要求及主任偏好" name="specialRequirement">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.specialRequirement"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入特殊要求及主任偏好' : '-'"
                            primaryColor="#0000001A"
                            validateTrigger="blur"
                        />
                    </uni-forms-item>
                    <uni-forms-item label="其他" name="others">
                        <uni-easyinput
                            :inputBorder="false"
                            type="textarea"
                            auto-height
                            v-model="form.others"
                            :disabled="!isEdit"
                            :placeholder="isEdit ? '请输入其他' : '-'"
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
