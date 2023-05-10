import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
// import WebpackBar from "webpackbar";
const WebpackBar = require("webpackbar");
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

// 返回处理样式loader的函数
const getStyleLoaders = (pre?: string): any => {
    return [
        { loader: "style-loader" },
        //         {test: /\.css$/i,
        //          // 匹配.css后缀的文件
        //          use: [{loader: "style-loader"},
        //          {loader: "css-loader",
        //          options: {
        //             /**** 需要解决的问题* 全局污染* 命名混乱* 依赖管理不彻底* 无法共享变量* 代码压缩不彻底*/
        //             modules: {
        //                  // 启用 css modules, css模块化, 所有类名都默认为当前组件, 或者使用 :global 声明全局样式, 参考 AntDesignPro 的样式引用
        //                  localIdentName: '[name]__[local]--[hash:base64:5]'
        //                  // 指定样式名},  }}]}
        // ,
        {
            loader: "css-loader",
            options: {
                // 启用/禁用 CSS 模块及其配置 默认为true
                /**** 需要解决的问题* 全局污染* 命名混乱* 依赖管理不彻底* 无法共享变量* 代码压缩不彻底*/
                modules: {
                    // localIdentName: "[name]__[local]--[hash:base64:5]",
                    localIdentName: "[name]-[local]--[hash:base64:5]",
                },
                //启用/禁用 @import 规则进行处理 默认为true 不需填写
                // import: true,
            },
        },
        {
            // 解决兼容性问题
            // 配合package.json中的browserslist来指定兼容性
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: ["postcss-preset-env"],
                },
            },
        },
        { loader: pre },
    ].filter((i) => i.loader);
};

/**
 * @type {Configuration}
 */
const config: Configuration = {
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/",
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/media/[hash:10][ext][query]",
    },
    module: {
        rules: [
            {
                oneOf: [
                    // 处理css
                    {
                        test: /\.css$/,
                        use: getStyleLoaders(),
                    },
                    {
                        // 处理less
                        test: /\.less$/,
                        use: getStyleLoaders("less-loader"),
                    },
                    {
                        // 处理sass/scss
                        test: /\.s[ac]ss$/,
                        use: getStyleLoaders("sass-loader"),
                    },
                    {
                        // 处理stylus
                        test: /\.styl$/,
                        use: getStyleLoaders("stylus-loader"),
                    },
                    {
                        // 处理glsl
                        test: /\.(frag|vert)$/,
                        use: "./loaders/glslLoader.js",
                    },
                    // 处理svg
                    {
                        test: /\.svg$/,
                        use: [
                            {
                                loader: "@svgr/webpack",
                                options: {
                                    prettier: false,
                                    svgo: false,
                                    svgoConfig: {
                                        plugins: [{ removeViewBox: false }],
                                    },
                                    titleProp: true,
                                    ref: true,
                                },
                            },
                            {
                                loader: "file-loader",
                                options: {
                                    name: "static/media/[name].[hash].[ext]",
                                },
                            },
                        ],
                        issuer: {
                            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
                        },
                    },
                    // 处理图片
                    {
                        test: /\.(jpe?g|png|gif|webp|svg)/,
                        type: "asset",
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
                            },
                        },
                    },
                    // 处理其他资源
                    {
                        test: /\.(ttf|woff2?|mp4|mp3|avi)$/,
                        type: "asset/resource",
                        generator: {},
                    },
                    // 处理js
                    {
                        test: /\.(ts|tsx|js|jsx)?$/,
                        include: path.resolve(__dirname, "../src"),
                        use: "babel-loader",
                    },
                ],
            },
        ],
    },
    // 处理html
    plugins: [
        new WebpackBar({
            color: "#85d",
            basic: false,
            profile: false,
        }),
        new ESLintWebpackPlugin({
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new ReactRefreshWebpackPlugin(),
    ],
    stats: "errors-warnings",
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        runtimeChunk: {
            name: (entrypoint: any) => `runtime~${entrypoint.name}.js`,
        },
    },
    // webpack解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
        alias: {
            "@": path.join(__dirname, "../src"),
        },
    },

    devServer: {
        host: "localhost",
        port: 4000,
        // open: true,
        hot: true,
        historyApiFallback: {
            index: "http://127.0.0.1:4000/",
        }, // 解决前端路由刷新404的问题
    },
};

module.exports = config;
