<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useUserStore } from "@/stores/user";
import { reLaunch } from "@/router/router";

onLaunch(() => {
    console.log("App Launch");
});
onShow(() => {
    console.log("App Show");
    const store = useUserStore();
    if (!store.token) {
        reLaunch({
            name: "signin",
        });
    }
});
onHide(() => {
    console.log("App Hide");
});
</script>
<style></style>
