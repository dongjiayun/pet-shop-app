<script setup lang="ts">
import PetContainer from "@/components/common/petContainer.vue";
import { HistoryModel } from "@/api";
import { onLoad } from "@dcloudio/uni-app";
import { ref, onMounted } from "vue";
import zeroTimeline from "@/components/common/zero-timeline.vue";
import dayjs from "dayjs";
import { useAppStore } from "@/stores/app";
import { push } from "@/router/router";

const petId = ref("");

onLoad((props) => {
    petId.value = props.petId;
});

const historyList = ref<any>([]);

const getHistoryList = () => {
    const tashList = [
        HistoryModel.getPetHistory({
            pageSize: 99999999,
            pageNo: 1,
            petId: petId.value,
        }).then((res) => {
            return res.data.list;
        }),
        HistoryModel.getWashRecordHistory({
            pageSize: 99999999,
            pageNo: 1,
            petId: petId.value,
        }).then((res) => {
            return res.data.list;
        }),
        HistoryModel.getEntrustmentHistory({
            pageSize: 99999999,
            pageNo: 1,
            petId: petId.value,
        }).then((res) => {
            return res.data.list;
        }),
    ];
    Promise.all(tashList).then((res) => {
        const list = res.flat(1);
        historyList.value = list
            .sort((a, b) => {
                return dayjs(a.editTime).valueOf() - dayjs(b.editTime).valueOf();
            })
            .map((i) => {
                return {
                    leftTime: dayjs(i.editTime).format("YYYY-MM-DD HH:mm:ss"),
                    leftTitle: i.type === "0" ? "新建" : "编辑",
                    title: `${i.editName}(${i.editEmail})`,
                    content: `${i.editName} 于 ${dayjs(i.editTime).format("YYYY-MM-DD HH:mm:ss")} ${i.type === "0" ? "新建" : "编辑"}了该宠物的 ${i.pet ? "基本档案" : i.petWashRecord ? "洗美档案" : i.petEntrustment ? "寄养档案" : ""}`,
                    sub: "点击查看详情",
                    color: i.pet
                        ? "#D4C800"
                        : i.petWashRecord
                          ? "#96E4FF"
                          : i.petEntrustment
                            ? "#FF9ECE"
                            : "#FCEB00",
                    data: i.pet || i.petWashRecord || i.petEntrustment,
                    type: i.pet
                        ? "pet"
                        : i.petWashRecord
                          ? "petWashRecord"
                          : i.petEntrustment
                            ? "petEntrustment"
                            : "",
                };
            });
    });
};

const handleClick = (item) => {
    const appStore = useAppStore();
    appStore.$patch({
        historyCache: item.data,
    });
    if (item.type === "pet") {
        push({
            name: "petBaseDetail",
            query: {
                isHistory: true,
            },
        });
    } else if (item.type === "petWashRecord") {
        push({
            name: "petWashDetail",
            query: {
                isHistory: true,
            },
        });
    } else {
        push({
            name: "petEntrustmentDetail",
            query: {
                isHistory: true,
            },
        });
    }
};

onMounted(() => {
    getHistoryList();
});
</script>

<template>
    <pet-container background-color="#FFF5F8" title="编辑历史">
        <view class="history-list">
            <zero-timeline :dataList="historyList" gap="30rpx" @click="handleClick"></zero-timeline>
        </view>
    </pet-container>
</template>

<style scoped lang="scss">
.history-list {
    padding: 20rpx;
}
</style>
