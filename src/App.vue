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
});
onShow(() => {
    console.log("App Show");
});
onHide(() => {
    console.log("App Hide");
});
</script>
<style></style>
