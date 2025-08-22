import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// 扩展 Day.js 插件
dayjs.extend(duration);
dayjs.extend(isSameOrAfter);

type ExpireConfig = string | number | { time: number; unit: dayjs.ManipulateType };

interface CookieAPI {
    cookie2Object(): Record<string, string>;
    set(key: string, data: string, expire?: ExpireConfig): string;
    get(key: string): string | undefined;
    remove(key: string): string;
    clear(): void;
}

export const Cookie: CookieAPI = {
    cookie2Object(): Record<string, string> {
        const cookieCache = document.cookie;
        const cookiesArray = cookieCache.split(";");
        const cookie: Record<string, string> = {};
        cookiesArray.forEach((i) => {
            if (i) {
                const [key, value] = i.split("=");
                cookie[key?.trim()] = String(value);
            }
        });
        return cookie;
    },
    set(key: string, data: string, expire?: ExpireConfig): string {
        const cookie = this.cookie2Object();
        cookie[key] = data;
        if (expire) {
            if (typeof expire === "string" || typeof expire === "number") {
                cookie.expire = dayjs().add(+expire, "day").toISOString();
            } else if (typeof expire === "object") {
                cookie.expire = dayjs().add(+expire.time, expire.unit).toISOString();
            }
        }
        const cookieStr = Object.entries(cookie)
            .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
            .join(";");
        return cookieStr;
    },
    get(key: string): string | undefined {
        const cookie = this.cookie2Object();
        return cookie[key];
    },
    remove(key: string): string {
        const cookie = this.cookie2Object();
        delete cookie[key];
        const cookieStr = Object.entries(cookie)
            .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
            .join(";");
        return cookieStr;
    },
    clear(): void {
        document.cookie = "";
    },
};

interface StorageData<T = any> {
    data: T;
    _expireTime?: string;
}

function setExpire<T>(data: T, expire?: ExpireConfig): StorageData<T> {
    const result: StorageData<T> = { data };
    if (expire) {
        if (typeof expire === "string" || typeof expire === "number") {
            result._expireTime = dayjs().add(+expire, "day").toISOString();
        } else if (typeof expire === "object") {
            result._expireTime = dayjs().add(+expire.time, expire.unit).toISOString();
        }
    }
    return result;
}

function getData<T>(key: string, res: StorageData<T> | T): T | undefined {
    if (res && typeof res === "object" && "data" in res) {
        const { data, _expireTime } = res as StorageData<T>;
        if (_expireTime) {
            if (dayjs().isSameOrAfter(dayjs(_expireTime))) {
                uni.removeStorageSync(key);
                return undefined;
            }
            return data;
        }
        return data;
    }
    return res as T;
}

interface LocalAPI {
    set<T>(key: string, data: T, expire?: ExpireConfig): void;
    get<T>(key: string): T | undefined;
    remove(key: string): void;
    clear(): void;
}

export const Local: LocalAPI = {
    set<T>(key: string, data: T, expire?: ExpireConfig): void {
        const res = setExpire(data, expire);
        uni.setStorageSync(key, JSON.stringify(res));
    },
    get<T>(key: string): T | undefined {
        try {
            const stored = uni.getStorageSync(key);
            if (!stored) return undefined;

            const data = JSON.parse(stored) as StorageData<T> | T;
            const res = getData(key, data);

            if (res && typeof res === "object" && Object.keys(res).length === 0) {
                return undefined;
            }
            return res;
        } catch (e) {
            console.error(`Failed to parse storage data for key ${key}:`, e);
            return undefined;
        }
    },
    remove(key: string): void {
        uni.removeStorageSync(key);
    },
    clear(): void {
        uni.clearStorageSync();
    },
};
