import { defineStore } from "pinia";
import { Local } from "@/utils/storage";
import { AuthModel } from "@/api/index";
import { reLaunch } from "@/router/router";

interface User {
    token: string;
    refreshToken: string;
    cid: string;
    avatar?: string;
    username: string;
    email: string;
    role: number;
}

interface LoginParam {
    // Define your login parameters here
    [key: string]: any;
}

export const useUserStore = defineStore("user", {
    state: (): User => ({
        token: "",
        refreshToken: "",
        cid: "",
        avatar: "",
        username: "",
        email: "",
        role: 0,
    }),
    actions: {
        setUserInfo(data?: Partial<User>) {
            if (data) {
                Object.assign(this, data);
            } else {
                const userInfoCache = Local.get("userinfo") as Partial<User> | null;
                if (userInfoCache) {
                    this.token = userInfoCache.token || "";
                    this.refreshToken = userInfoCache.refreshToken || "";
                    this.cid = userInfoCache.cid || "";
                    this.avatar = userInfoCache.avatar || "";
                    this.username = userInfoCache.username || "";
                    this.email = userInfoCache.email || "";
                    this.role = userInfoCache.role || 0;
                }
            }
        },
        logout(): Promise<void> {
            return AuthModel.logout().then(() => {
                this.token = "";
                this.refreshToken = "";
                this.cid = "";
                this.avatar = "";
                this.username = "";
                this.email = "";
                this.role = 0;
                reLaunch({
                    name: "home",
                });
            });
        },
        login(param: LoginParam): Promise<void> {
            const userInfo = Local.get("userInfo") as Partial<User> | null;
            if (userInfo) {
                this.setUserInfo(userInfo);
                return Promise.resolve();
            }
            if (param) {
                uni.showLoading({
                    title: "登陆中,请稍后...",
                    mask: true,
                });
                return AuthModel.login(param).then((res) => {
                    if (res.status !== 200) {
                        uni.hideLoading();
                        uni.showToast({
                            title: res.message,
                            icon: "none",
                        });
                        return Promise.reject(new Error(res.message));
                    }
                    const uInfo = res.data;
                    this.token = uInfo.token;
                    this.refreshToken = uInfo.refreshToken;
                    this.cid = uInfo.cid;
                    this.avatar = uInfo.avatar;
                    this.username = uInfo.username;
                    this.email = uInfo.email;
                    this.role = uInfo.role;
                    Local.set("userInfo", {
                        ...this.$state,
                    });
                    this.setUserInfo(this.$state);
                    uni.hideLoading();
                    reLaunch({
                        name: "home",
                    });
                });
            } else {
                return Promise.reject(new Error("Login parameters are required"));
            }
        },
        handleRefreshToken() {
            uni.showLoading({
                title: "登陆中,请稍后...",
                mask: true,
            });
            return AuthModel.refreshToken().then((res) => {
                const uInfo = res.data;
                this.token = uInfo.token;
                this.refreshToken = uInfo.refreshToken;
                this.cid = uInfo.cid;
                this.avatar = uInfo.avatar;
                this.username = uInfo.username;
                this.email = uInfo.email;
                this.role = uInfo.role;
                Local.set("userInfo", {
                    ...this.$state,
                });
                this.setUserInfo(this.$state);
                uni.hideLoading();
            });
        },
    },
});
