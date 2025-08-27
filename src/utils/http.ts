import { objectTreeShake } from "@/utils";
import { push } from "@/router/router";
import { useUserStore } from "@/stores/user";
import { baseUrl } from "@/config/index";

interface RequestConfig {
    customErr?: boolean;
    hideNotFound?: boolean;
    logoutDisabled?: boolean;
    [key: string]: any;
}

interface ErrorResponse {
    code?: number;
    message?: string;
    data?: any;
    response?: any;
    config?: RequestConfig;
}

interface FileResponse {
    fileName: string;
    content: any;
}

interface ResponseData<T = any> {
    data?: T;
    message?: string;
    status?: number;
}

const errMsg = (message: string) => {
    uni.showToast({
        title: message,
        icon: "none",
        duration: 2000,
    });
};

export const request = <T = any>(
    apiUrl: string,
    data: any,
    method: "GET" | "POST" | "PUT" | "DELETE",
    config?: RequestConfig
): Promise<T> => {
    let url = baseUrl + apiUrl;
    const store = useUserStore();
    const contentType = config?.contentType || "application/json";
    const header: Record<string, string> = {
        "Content-Type": contentType,
        Authorization: store.token,
        "Refresh-Token": store.refreshToken,
    };

    // 处理 GET 请求参数
    if (method === "GET") {
        const params = Object.keys(data)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
            .join("&");
        if (params) {
            url += (url.includes("?") ? "&" : "?") + params;
        }
    } else {
        data = objectTreeShake(data);
    }

    uni.showLoading({
        title: "加载中...",
        mask: true,
    });

    return new Promise((resolve, reject) => {
        if (config?.contentType === "multipart/form-data") {
            uni.uploadFile({
                url,
                method: method.toLowerCase() as any,
                filePath: data.file,
                name: "file",
                header,
                success: (res) => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(res.data) || (res.data as T));
                    } else {
                        const error = {
                            code: res.statusCode,
                            response: res,
                            config,
                        };
                        responseInterceptorsResolve(error, config).then(resolve).catch(reject);
                    }
                },
                fail: (err) => {
                    responseInterceptorsReject(err, url, config).then(resolve).catch(reject);
                },
                complete: () => {
                    setTimeout(() => {
                        uni.hideLoading();
                    }, 200);
                },
            });
        } else {
            uni.request({
                url,
                method: method.toLowerCase() as any,
                data: method !== "GET" ? data : {},
                header,
                success: (res) => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(res.data as T);
                    } else {
                        const error = {
                            code: res.statusCode,
                            response: res,
                            config,
                        };
                        responseInterceptorsResolve(error, config).then(resolve).catch(reject);
                    }
                },
                fail: (err) => {
                    responseInterceptorsReject(err, url, config).then(resolve).catch(reject);
                },
                complete: () => {
                    setTimeout(() => {
                        uni.hideLoading();
                    }, 200);
                },
            });
        }
    });
};

const responseInterceptorsResolve = async <T = any>(
    error: ErrorResponse,
    config?: RequestConfig
): Promise<T | FileResponse> => {
    if (config?.customErr) {
        return Promise.reject(error);
    }

    const status = error.code || 500;
    const response = error.response || {};
    const contentType = response.header?.["content-type"] || "";

    if (status === 401) {
        const store = useUserStore();
        const userinfo = uni.getStorageSync("userinfo");
        if (store.refreshToken || userinfo?.refreshToken) {
            store.handleRefreshToken();
        } else {
            push("signin");
        }
        return Promise.reject({ code: status, response } as ErrorResponse);
    }

    if (status === 403) {
        errMsg("权限不足,请联系管理员");
        return Promise.reject({ code: status, response } as ErrorResponse);
    }

    if (status === 500) {
        const errorData = response.data || {};
        errMsg(errorData.message || "服务器错误");
        return Promise.reject({ code: 500, message: errorData.message, response } as ErrorResponse);
    }

    if (status === -501000) {
        return Promise.reject({ code: status, response } as ErrorResponse);
    }

    const errorData = response.data || {};
    errMsg(errorData.message || "请求错误");
    return Promise.reject({
        code: status,
        message: errorData.message,
        data: errorData,
        response,
    } as ErrorResponse);
};

const responseInterceptorsReject = (
    error: any,
    url: string,
    config?: RequestConfig
): Promise<never> => {
    const errCode = error.errno || error.code || (error.response && error.response.statusCode);

    if (config?.hideNotFound && errCode === 404) {
        console.log("请求错误,未找到该资源");
        return Promise.reject(error);
    }

    if (errCode === 401 || errCode === 403) {
        if (config?.logoutDisabled) {
            console.log("登陆超时,请重新登陆");
            return Promise.reject(error);
        }
    }

    let errMessage = "";
    switch (errCode) {
        case 400:
            errMessage = "错误请求";
            break;
        case 404:
            errMessage = "请求错误,未找到该资源";
            break;
        case 405:
            errMessage = "请求方法未允许";
            break;
        case 408:
            errMessage = "请求超时";
            break;
        case 409:
            errMessage = "服务器在完成请求时发生冲突";
            break;
        case 410:
            errMessage = "请求的资源已被永久删除";
            break;
        case 411:
            errMessage = "需要有效长度";
            break;
        case 413:
            errMessage = "请求实体过大";
            break;
        case 414:
            errMessage = "请求的 URI 过长";
            break;
        case 415:
            errMessage = "不支持的媒体类型";
            break;
        case 500:
            errMessage = error.message || "服务器端出错";
            break;
        case 501:
            errMessage = "网络未实现";
            break;
        case 502:
            errMessage = "网络错误";
            break;
        case 503:
            errMessage = "服务不可用";
            break;
        case 504:
            errMessage = "网络超时";
            break;
        case 505:
            errMessage = "http版本不支持该请求";
            break;
        default:
            errMessage = error.errMsg || `连接错误${errCode}`;
    }

    errMsg(`${url}：${errMessage}`);
    error.message = `${url}：${errMessage}`;
    return Promise.reject(error);
};

export const get = <T = any>(apiUrl: string, data?: any, config?: RequestConfig): Promise<T> => {
    const params = {
        ...data,
        _t: new Date().getTime(),
    };
    return request<T>(apiUrl, params, "GET", config);
};

export const post = <T = any>(apiUrl: string, data?: any, config?: RequestConfig): Promise<T> => {
    return request<T>(apiUrl, data, "POST", config);
};

export const put = <T = any>(apiUrl: string, data?: any, config?: RequestConfig): Promise<T> => {
    return request<T>(apiUrl, data, "PUT", config);
};

export const del = <T = any>(apiUrl: string, data?: any, config?: RequestConfig): Promise<T> => {
    return request<T>(apiUrl, data, "DELETE", config);
};
