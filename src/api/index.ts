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

export const PetModel: ApiModel = {
    createPet(data) {
        return post("/pet", data);
    },
    getPetDetail(petId) {
        return get("/pet/" + petId);
    },
    updatePet(data) {
        return put("/pet", data);
    },
    getList(data) {
        return post("/pet/list", data);
    },
};

export const PetWashRecordModel: ApiModel = {
    createPetWashRecord(data) {
        return post("/washRecord", data);
    },
    getPetWashRecord(petId) {
        return get("/washRecord/" + petId);
    },
    updatePetWashRecord(data) {
        return put("/washRecord", data);
    },
};

export const PetEntrustmentModel: ApiModel = {
    createPetEntrustment(data) {
        return post("/entrustment", data);
    },
    getPetEntrustment(petId) {
        return get("/entrustment/" + petId);
    },
    updatePetEntrustment(data) {
        return put("/entrustment", data);
    },
};

export const DictModel: ApiModel = {
    getDict(key) {
        return get("/dict/" + key);
    },
};

export const UploadModel: ApiModel = {
    uploadPic(data) {
        return post("/common/uploadPic", data, {
            contentType: "multipart/form-data",
        });
    },
};
