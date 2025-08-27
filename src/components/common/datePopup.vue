<script setup lang="ts">
import PetPopup from "@/components/common/petPopup.vue";
import { ref } from "vue";

const props = defineProps({
    title: {
        type: String,
        default: "选择日期",
    },
});

const popup = ref();

const open = () => {
    popup.value.open();
};

const close = () => {
    popup.value.close();
};

const date = ref();

const handleSubmit = () => {
    close();
    emit("submit", date.value);
};

const handleDateChange = (e) => {
    date.value = e.fulldate;
};

const emit = defineEmits(["submit"]);

defineExpose({ open, close });
</script>

<template>
    <pet-popup ref="popup" :title="title" @submit="handleSubmit">
        <uni-calendar @change="handleDateChange" />
    </pet-popup>
</template>

<style scoped lang="scss"></style>
