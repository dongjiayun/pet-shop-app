<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import PetPopup from "./petPopup.vue";
import { DictModel } from "@/api";
import triggerIndexList from "@/components/common/pet-index-list/trigger-indexList/trigger-indexList.vue";
import triggerIndexListItem from "@/components/common/pet-index-list/trigger-indexList_item/trigger-indexList_item.vue";

const popup = ref();

interface BreedList {
    type: string;
    name: string;
    breeds: Breed[];
}

interface Breed {
    id: string;
    name: string;
}

const search = ref("");

const breedList = ref<BreedList[]>([]);

const data = ref<Breed>();

const _list = computed(() => {
    const typeId = props.type; // 直接依赖响应式prop
    const typeName = typeId === "0" ? "cat" : typeId === "1" ? "dog" : "others";
    return breedList.value.find((item) => item.type === typeName)?.breeds || [];
});

const list = computed(() => {
    if (search.value) {
        return _list.value?.filter((item) => item.name.includes(search.value));
    }
    return _list.value;
});

const props = defineProps({
    type: {
        type: String,
        default: "0",
    },
});

const open = () => {
    popup.value.open();
};

const getBreedList = () => {
    DictModel.getDict("breed").then((res) => {
        if (res.status !== 0) {
            uni.showToast({
                title: res.message,
                icon: "none",
            });
            return;
        }
        breedList.value = res.data;
        breedList.value?.push({
            type: "others",
            name: "其他",
            breeds: [{ id: 999999, name: "异宠请在备注中说明" }],
        });
    });
};

const handleClick = (item) => {
    data.value = item;
};

const handleSearch = (e) => {
    search.value = e.value;
};

const handleSubmit = () => {
    popup.value.close();
    emit("submit", data.value);
};

onMounted(() => {
    getBreedList();
});

const emit = defineEmits(["submit"]);

defineExpose({ open });
</script>

<template>
    <pet-popup ref="popup" title="选择品种" @submit="handleSubmit">
        <view class="search">
            <uni-search-bar
                style="width: 680rpx"
                v-model="search"
                placeholder="搜索品种"
                cancelButton="none"
                :radius="100"
                bgColor="#F5E9EB"
                textColor="#402B2C"
                @input="handleSearch"
            ></uni-search-bar>
        </view>
        <scroll-view class="scroll-view" scroll-y>
            <trigger-index-list
                :list="list"
                height="50vh"
                indexActiveColor="#FF9ECE"
                :showEmptyDataElement="false"
                moveBoxStyle="{background: '#FFECF5'}"
            >
                <template #default="{ indexList }">
                    <trigger-index-list-item
                        v-for="(item, index) in indexList"
                        :key="index"
                        :item="item"
                    >
                        <template #lineBody>
                            <view v-for="(child, childIndx) in item.data" :key="childIndx">
                                <view
                                    class="line"
                                    :class="{ active: data?.id === child?.id }"
                                    @click="handleClick(child)"
                                    >{{ child.name }}</view
                                >
                            </view>
                        </template>
                    </trigger-index-list-item>
                </template>
            </trigger-index-list>
        </scroll-view>
    </pet-popup>
</template>

<style scoped lang="scss">
.search {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
}
.scroll-view {
    max-height: 50vh;
    margin-bottom: 20rpx;
    .line {
        padding: 10rpx 20rpx;
        margin: 10rpx 0;
        border-radius: 8rpx;
        &.active {
            background-color: #ffecf5;
        }
    }
}
</style>
