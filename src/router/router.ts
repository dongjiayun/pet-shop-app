import { routes } from "./routes.config";
import { isNullOrEmpty } from "../utils";

// 定义基础类型
export type QueryParamValue = string | number | boolean | undefined;
export type QueryParams = Record<string, QueryParamValue>;
export type RouteParams = Record<string, QueryParamValue>;

// 路由配置接口
export interface RouteConfig {
    name: string;
    path: string;
    // 可以根据需要扩展更多字段
    meta?: Record<string, any>;
    component?: any;
}

// 路由对象接口
export interface RouteObject {
    name?: string;
    path?: string;
    query?: QueryParams;
    param?: RouteParams;
}

// 解析选项接口
export interface ResolveOptions {
    name?: string;
    path?: string;
    query?: QueryParams;
    params?: RouteParams;
}

// 路由结果接口
export interface RouterResult {
    href: string;
}

// 泛型查找函数
const findObj = <T extends RouteConfig>(arr: T[], val: string, key: keyof T = "name"): number => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === val) {
            return i;
        }
    }
    return -1;
};

// 解析路由路径和参数
const resolve = ({ name, path, query = {}, params = {} }: ResolveOptions): string => {
    let _path = "";

    if (name) {
        _path = getRouterByName(name);
    } else if (path) {
        _path = path;
    } else {
        throw new Error("Either name or path must be provided");
    }

    // 合并查询参数和路由参数
    const allQueryParams: QueryParams = { ...query, ...params };

    const queryString = Object.entries(allQueryParams)
        .filter(([_, value]) => !isNullOrEmpty(value))
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join("&");

    return queryString ? `${_path}?${queryString}` : _path;
};

// 根据名称获取路由路径
const getRouterByName = (name: string): string => {
    const index = findObj(routes, name, "name");
    if (index === -1) {
        throw new Error(`Route with name '${name}' not found`);
    }
    return routes[index].path;
};

// 获取路由结果
const getRouter = (to: RouteObject | string): RouterResult => {
    if (typeof to === "string") {
        return { href: `/${to}` };
    }

    if (to.path) {
        const { query, param, path } = to;
        return {
            href: resolve({
                path,
                query,
                params: param,
            }),
        };
    } else if (to.name) {
        const index = findObj(routes, to.name, "name");
        if (index === -1) {
            throw new Error(`Route with name '${to.name}' not found`);
        }
        const { path } = routes[index];
        const { query, param } = to;
        return {
            href: resolve({
                path,
                query,
                params: param,
            }),
        };
    }

    throw new Error("Invalid route configuration: must provide either name or path");
};

// 导航到页面
const push = (to: RouteObject | string): void => {
    const { href } = getRouter(to);
    uni.navigateTo({ url: href });
};

const switchTab = (to: RouteObject | string): void => {
    const { href } = getRouter(to);
    uni.switchTab({ url: href });
};

const back = (): void => {
    uni.navigateBack().catch((error) => {
        if (error.errMsg === "navigateBack:fail cannot navigate back at first page.") {
            switchTab({
                name: "home",
            });
        }
    });
};

// 重定向到页面
const redirectTo = (to: RouteObject | string): void => {
    const { href } = getRouter(to);
    uni.redirectTo({ url: href });
};

// 重新启动到页面
const reLaunch = (to: RouteObject | string): void => {
    const { href } = getRouter(to);
    uni.reLaunch({ url: href });
};

// 获取当前路由名称
const getCurrentRouteName = (): string | undefined => {
    try {
        const pages = getCurrentPages();

        if (!pages || pages.length === 0) {
            console.warn("No pages in current stack");
            return undefined;
        }

        const currentPage = pages[pages.length - 1];

        if (!currentPage?.route) {
            console.warn("Current page or route is undefined");
            return undefined;
        }

        const currentRoutePath = "/" + currentPage.route;
        const routeIndex = findObj(routes, currentRoutePath, "path");

        if (routeIndex === -1) {
            console.warn(`Route with path '${currentRoutePath}' not found in routes config`);
            return undefined;
        }

        const route = routes[routeIndex];
        return route.name;
    } catch (error) {
        console.error("Error getting current route name:", error);
        return undefined;
    }
};

// 获取当前路由完整信息
const getCurrentRoute = (): RouteConfig | undefined => {
    try {
        const pages = getCurrentPages();

        if (!pages || pages.length === 0) {
            return undefined;
        }

        const currentPage = pages[pages.length - 1];
        const currentRoutePath = currentPage?.route;

        if (!currentRoutePath) {
            return undefined;
        }

        const routeIndex = findObj(routes, currentRoutePath, "path");
        return routeIndex !== -1 ? routes[routeIndex] : undefined;
    } catch (error) {
        console.error("Error getting current route:", error);
        return undefined;
    }
};

export {
    getRouter,
    push,
    switchTab,
    back,
    redirectTo,
    reLaunch,
    getCurrentRouteName,
    getCurrentRoute,
};
