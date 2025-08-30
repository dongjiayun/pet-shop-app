<script setup lang="ts">
import PetContainer from "@/components/common/petContainer.vue";
import zPaging from "@/components/plugins/z-paging/z-paging.vue";
import { UserModel } from "@/api";
import { ref, onMounted } from "vue";
import { getDictNameById } from "@/utils";
import PetPopup from "@/components/common/petPopup.vue";

const search = ref("");

const pagingRef = ref();

const rolePopup = ref();

const staffList = ref([]);

const dicts = {
    role: [
        { id: 0, name: "游客" },
        { id: 1, name: "员工" },
        { id: 2, name: "管理员" },
        { id: 3, name: "超级管理员" },
        { id: 4, name: "已离职" },
    ],
};

const handleSearch = (e) => {
    search.value = e.value;
    pagingRef.value.reload();
    getStaffList();
};

const handleClearSearch = () => {
    pagingRef.value.reload();
    getStaffList();
};

const getStaffList = (pageNo = 1, pageSize = 20) => {
    const params = {
        pageNo,
        pageSize,
        keyword: search.value,
    };
    UserModel.getUserList(params).then((res) => {
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

const currentCid = ref("");

const handleChoose = (item) => {
    if (item.role === 3) {
        return;
    }
    currentCid.value = item.cid;
    rolePopup.value.open();
};

const handleChooseRole = (role) => {
    UserModel.setPermission({
        cid: currentCid.value,
        role,
    }).then((res) => {
        if (res.status !== 0) {
            uni.showToast({
                title: res.message,
                icon: "none",
            });
            return Promise.reject(new Error(res.message));
        }
        setTimeout(() => {
            uni.showToast({
                title: "修改成功",
            });
        }, 500);
        pagingRef.value.reload();
        getStaffList();
    });
};

onMounted(() => {
    getStaffList();
});
</script>

<template>
    <pet-container background-color="#FFF5F8" title="权限设置">
        <view class="search">
            <uni-search-bar
                style="width: 680rpx"
                v-model="search"
                placeholder="搜索员工昵称/邮箱"
                cancelButton="none"
                bgColor="#F5E9EB"
                textColor="#402B2C"
                :radius="100"
                @confirm="handleSearch"
                @clear="handleClearSearch"
            ></uni-search-bar>
        </view>
        <view class="subtitle">{{ search ? "" : "全部员工" }}</view>
        <z-paging
            v-model="staffList"
            ref="pagingRef"
            :fixed="false"
            @query="getStaffList"
            height="calc(100vh - var(--status-bar-height) - 360rpx)"
        >
            <view class="Staff-list">
                <view
                    class="staff-list-item"
                    v-for="item in staffList"
                    :key="item.petId"
                    @click="handleChoose(item)"
                >
                    <view class="staff-list-item-avatar">
                        <image
                            :src="item.avatar.fileUrl || '/static/icons/avatar.jpg'"
                            class="staff-list-item-avatar-image"
                        ></image>
                    </view>
                    <view class="staff-list-item-info">
                        <view style="margin-bottom: 8rpx">{{ item.username }}</view>
                        <view style="color: #939393; font-size: 20rpx">{{ item.email }}</view>
                    </view>
                    <view class="staff-list-item-role">
                        {{ getDictNameById(dicts.role, item.role) }}
                    </view>
                    <view class="staff-list-item-btn" v-if="item.role !== 3">
                        <image
                            src="@/assets/icons/left.png"
                            class="staff-list-item-btn-icon"
                        ></image>
                    </view>
                </view>
            </view>
        </z-paging>
    </pet-container>
    <pet-popup
        ref="rolePopup"
        title="选择权限"
        :list="dicts.role.filter((item) => item.id !== 3)"
        @submit="handleChooseRole"
    ></pet-popup>
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
.staff-list {
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
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-family: PingFang SC;
            font-weight: 500;
            font-style: Medium;
            font-size: 28rpx;
            leading-trim: NONE;
            line-height: 16px;
            letter-spacing: -2%;
            text-align: center;
            vertical-align: middle;
            color: #402b2c;
            &-row + &-row {
                margin-top: 8rpx;
            }
        }
        &-role {
            display: flex;
            align-items: center;
            font-family: PingFang SC;
            font-weight: 500;
            font-style: Medium;
            font-size: 28rpx;
            leading-trim: NONE;
            line-height: 16px;
            letter-spacing: -2%;
            text-align: center;
            vertical-align: middle;
            color: #6b58589e;
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
