<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useUserStore } from "@/stores/user";
import { reLaunch } from "@/router/router";

onLaunch(() => {
    console.log("App Launch");
    const store = useUserStore();
    store.setUserInfo();
    if (!store.token) {
        reLaunch({
            name: "signin",
        });
    } else {
        store.getUserInfo();
    }

    const updateManager = uni.getUpdateManager();
    updateManager.onUpdateReady(() => {
        uni.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否马上重启小程序？",
            success: (res) => {
                if (res.confirm) {
                    updateManager.applyUpdate();
                }
            },
        });
    });
});
onShow(() => {
    console.log("App Show");
});
onHide(() => {
    console.log("App Hide");
});
</script>
<style></style>
