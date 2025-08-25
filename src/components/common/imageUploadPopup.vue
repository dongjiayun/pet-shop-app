<script setup lang="ts">
import { ref } from "vue";
import PetPopup from "@/components/common/petPopup.vue";
const popup = ref();

const props = defineProps({
    imageCount: {
        type: Number,
        default: 1,
    },
});

const open = () => {
    popup.value.open();
};

const list = ref([
    { id: 1, name: "拍照" },
    { id: 2, name: "相册" },
]);

const handleChoose = (id) => {
    uni.chooseImage({
        count: props.imageCount,
        sizeType: ["compressed"],
        sourceType: [id === 1 ? "camera" : "album"],
        success: (res) => {
            emit("submit", res.tempFilePaths);
            popup.value.close();
        },
    });
};

const emit = defineEmits(["submit"]);

defineExpose({ open });
</script>

<template>
    <pet-popup
        ref="popup"
        title="选择图片"
        :list="list"
        :default-choise="1"
        @submit="handleChoose"
    ></pet-popup>
</template>

<style scoped lang="scss"></style>
