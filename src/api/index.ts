import { post, get, put } from "@/utils/http";
import { useUserStore } from "@/stores/user";

interface ApiModel {
    [key: string]: (params?: any) => Promise<any>;
}

export const AuthModel: ApiModel = {
    login(data) {
        return post("/auth/signIn", data);
    },
    refresh(data) {
        return post("/auth/refreshToken", data);
    },
    logout(data) {
        return post("/auth/signOut", data);
    },
    sendEmailOtp(data) {
        return post("/auth/sendEmailOtp", data);
    },
    sendSignupEmailOtp(data) {
        return post("/auth/sendSignupEmailOtp", data);
    },
    sendResetEmailOtp(data) {
        return post("/auth/sendResetEmailOtp", data);
    },
    resetPassword(data) {
        return post("/auth/resetPassword", data);
    },
    findbackPassword(data) {
        return post("/auth/findbackPassword", data);
    },
    resetPasswordByOtp(data) {
        return post("/auth/resetPasswordByOtp", data);
    },
};

export const UserModel: ApiModel = {
    getUser() {
        const store = useUserStore();
        return get("/user/" + store.cid);
    },
    updateUserInfo(data) {
        const store = useUserStore();
        return put("/user/", { cid: store.cid, ...data });
    },
};

export const DictModel: ApiModel = {
    getDict(key) {
        return get("/dict/" + key);
    },
};
