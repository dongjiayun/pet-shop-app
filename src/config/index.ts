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
        baseUrl: "https://api.birkinpet.cn",
    },
    production: {
        baseUrl: "https://api.birkinpet.cn",
    },
};

const envName = process.env.NODE_ENV || "development";

// 确保环境名称有效，默认为development
const validEnvName = CONFIG[envName] ? envName : "development";

const currentConfig = CONFIG[validEnvName];

// 直接导出 baseUrl，方便其他模块直接导入
export const { baseUrl } = currentConfig;

// 也可以导出整个配置对象（可选）
export default currentConfig;
