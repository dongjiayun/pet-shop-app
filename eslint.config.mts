// eslint.config.mts
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        ignores: ["node_modules/**", "dist/**"],
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            pluginVue.configs["flat/essential"],
            // 确保 prettierConfig 在最后，以覆盖其他规则
            prettierConfig,
        ],
        plugins: {
            js,
            "@typescript-eslint": tseslint.plugin,
            vue: pluginVue,
            prettier: prettierPlugin,
        },
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                parser: tseslint.parser,
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        rules: {
            // 移除 ESLint 的 indent 规则，由 Prettier 控制缩进
            indent: "off",
            "vue/multi-word-component-names": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "prettier/prettier": [
                "error",
                {
                    // 在这里定义 Prettier 的缩进规则
                    tabWidth: 4,
                    useTabs: false,
                    printWidth: 100,
                    singleQuote: false,
                    semi: true,
                    trailingComma: "es5",
                    bracketSpacing: true,
                    arrowParens: "always",
                    endOfLine: "auto",
                },
            ],
        },
    },
    // 为Vue文件设置特定的规则
    {
        files: ["**/*.vue"],
        rules: {
            // 移除 Vue 的缩进规则，由 Prettier 控制
            "vue/html-indent": "off",
            "vue/script-indent": "off",
            "vue/attributes-order": "off",
            "vue/one-component-per-file": "off",
        },
    },
    // 单独处理CSS和SCSS文件
    {
        ignores: ["node_modules/**", "dist/**"],
        files: ["**/*.{css,scss}"],
        extends: [prettierConfig],
        plugins: { prettier: prettierPlugin },
        rules: {
            "prettier/prettier": [
                "error",
                {
                    // 确保 CSS/SCSS 的缩进与项目一致
                    tabWidth: 4,
                },
            ],
        },
    },
]);
