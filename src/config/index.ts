interface EnvironmentConfig {
    baseUrl: string;
}

interface Config {
    development: EnvironmentConfig;
    production: EnvironmentConfig;
    [key: string]: EnvironmentConfig; // 索引签名允许其他可能的键
}

const CONFIG: Config = {
    development: {
        baseUrl: "http://127.0.0.1:2088",
    },
    production: {
        baseUrl: "http://127.0.0.1:2088",
    },
};

const env = import.meta.env;
const envName = env.VITE_USER_NODE_ENV?.NODE_ENV || "development";

// 确保环境名称有效，默认为development
const validEnvName = CONFIG[envName] ? envName : "development";

const currentConfig = CONFIG[validEnvName];

// 直接导出 baseUrl，方便其他模块直接导入
export const { baseUrl } = currentConfig;

// 也可以导出整个配置对象（可选）
export default currentConfig;
