<script setup lang="ts">
import PetContainer from "@/components/common/petContainer.vue";
import zPaging from "@/components/plugins/z-paging/z-paging.vue";
import { PetModel } from "@/api";
import { ref, onMounted } from "vue";
import GenderIcon from "@/components/common/genderIcon.vue";
import { getDictNameById } from "@/utils";
import { push } from "@/router/router";
import { useUserStore } from "@/stores/user";

const props = defineProps({
    isSelf: {
        type: Boolean,
        default: false,
    },
    isHistory: {
        type: Boolean,
        default: false,
    },
});

const search = ref("");

const pagingRef = ref();

const petList = ref([]);

const dicts = {
    type: [
        { id: "0", name: "猫" },
        { id: "1", name: "狗" },
        { id: "2", name: "其他" },
    ],
};

const handleSearch = (e) => {
    search.value = e.value;
    pagingRef.value.reload();
    getPetList();
};

const handleClearSearch = () => {
    pagingRef.value.reload();
    getPetList();
};

const getPetList = (pageNo = 1, pageSize = 20) => {
    const params = {
        pageNo,
        pageSize,
        keyword: search.value,
        cid: "",
    };
    if (props.isSelf) {
        const store = useUserStore();
        params.cid = store.cid;
    }
    PetModel.getList(params).then((res) => {
        if (res.status !== 0) {
            uni.showToast({
                title: res.message,
                icon: "none",
            });
            pagingRef.value.complete(false);
            return Promise.reject(new Error(res.message));
        }
        const list = res.data.list;
        if (Array.isArray(list)) {
            pagingRef.value.complete(list);
        }
    });
};

const handleChoose = (petId) => {
    if (props.isHistory) {
        push({
            name: "petEditHistory",
            query: {
                petId,
            },
        });
    } else {
        push({
            name: "petDetail",
            query: {
                petId,
            },
        });
    }
};

onMounted(() => {
    getPetList();
});
</script>

<template>
    <pet-container background-color="#FFF5F8" title="宠物列表">
        <view class="search">
            <uni-search-bar
                style="width: 680rpx"
                v-model="search"
                placeholder="搜索宠物昵称/客户昵称/客户手机尾号"
                cancelButton="none"
                bgColor="#F5E9EB"
                textColor="#402B2C"
                :radius="100"
                @confirm="handleSearch"
                @clear="handleClearSearch"
            ></uni-search-bar>
        </view>
        <view class="subtitle">{{ search ? "" : "全部宠物" }}</view>
        <z-paging
            v-model="petList"
            ref="pagingRef"
            :fixed="false"
            @query="getPetList"
            height="calc(100vh - var(--status-bar-height) - 360rpx)"
        >
            <view class="pet-list">
                <view
                    class="pet-list-item"
                    v-for="item in petList"
                    :key="item.petId"
                    @click="handleChoose(item.petId)"
                >
                    <view class="pet-list-item-avatar">
                        <image
                            :src="item.avatar || '/static/icons/pet_avatar.png'"
                            class="pet-list-item-avatar-image"
                        ></image>
                    </view>
                    <view class="pet-list-item-info">
                        <view class="pet-list-item-info-row">
                            <view class="pet-list-item-info-row-name">{{ item.nickName }}</view>
                            <gender-icon
                                is-bg
                                :gender="item.gender === '0' ? 'male' : 'female'"
                            ></gender-icon>
                        </view>
                        <view class="pet-list-item-info-row">
                            <view class="pet-list-item-info-row-type">{{
                                getDictNameById(dicts.type, item.type)
                            }}</view>
                            <view class="pet-list-item-info-row-breed"
                                >| {{ item.breed.name }}</view
                            >
                        </view>
                    </view>
                    <view class="pet-list-item-btn">
                        <image src="@/assets/icons/left.png" class="pet-list-item-btn-icon"></image>
                    </view>
                </view>
            </view>
        </z-paging>
    </pet-container>
</template>

<style scoped lang="scss">
.subtitle {
    font-family: PingFang SC;
    font-weight: 400;
    font-style: Regular;
    font-size: 24rpx;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: -2%;
    color: #939393;
    padding: 0 32rpx;
    display: flex;
    align-items: center;
    height: 52rpx;
}
.pet-list {
    &-item {
        padding: 28rpx 32rpx;
        display: flex;
        align-items: center;
        border-bottom: 4rpx solid #ffecf5;
        &-avatar {
            width: 96rpx;
            height: 96rpx;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 20rpx;
            &-image {
                width: 100%;
                height: 100%;
            }
        }
        &-info {
            flex: 1;
            &-row {
                display: flex;
                align-items: center;
                &-name {
                    font-family: PingFang SC;
                    font-weight: 500;
                    font-style: Medium;
                    font-size: 28rpx;
                    leading-trim: NONE;
                    letter-spacing: -2%;
                    text-align: center;
                    vertical-align: middle;
                    color: #402b2c;
                    margin-right: 12rpx;
                }
                &-type {
                    font-family: PingFang SC;
                    font-weight: 400;
                    font-style: Regular;
                    font-size: 24rpx;
                    leading-trim: NONE;
                    letter-spacing: -2%;
                    text-align: center;
                    vertical-align: middle;
                    margin-right: 12rpx;
                }
                &-breed {
                    font-family: PingFang SC;
                    font-weight: 400;
                    font-style: Regular;
                    font-size: 24rpx;
                    leading-trim: NONE;
                    letter-spacing: 0%;
                    text-align: center;
                    color: #48423680;
                }
            }
            &-row + &-row {
                margin-top: 8rpx;
            }
        }
        &-btn {
            display: flex;
            align-items: center;
            &-icon {
                width: 32rpx;
                height: 32rpx;
            }
        }
    }
}
</style>
