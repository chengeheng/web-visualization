// import { Configuration } from "webpack";
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// 返回处理样式loader的函数
const getStyleLoaders = pre => {
	return [
		MiniCssExtractPlugin.loader,
		"css-loader",
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
		pre,
	].filter(Boolean);
};

/**
 * @type {Configuration}
 */
const config = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "static/js/[name].[contenthash:10].js",
		chunkFilename: "static/js/[name].[contenthash:10].chunk.js",
		assetModuleFilename: "static/media/[hash:10][ext][query]",
		clean: true,
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
						test: /\.jsx?$/,
						include: path.resolve(__dirname, "../src"),
						use: [
							{
								loader: "babel-loader",
								options: {
									cacheDirectory: true, // 开启babel编译缓存
									cacheCompression: false, // 缓存文件不要压缩
								},
							},
						],
					},
				],
			},
		],
	},
	// 处理html
	plugins: [
		new ESLintWebpackPlugin({
			context: path.resolve(__dirname, "../src"),
			exclude: "node_modules",
			cache: true,
			cacheLocation: path.resolve(
				__dirname,
				"../node_modules/.cache/.eslintcache"
			),
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "../public/index.html"),
		}),
		new MiniCssExtractPlugin({
			filename: "static/css/[name].[contenthash:10].css",
			chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
		}),
		// 将public下面的资源复制到dist目录去（除了index.html）
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "../public"),
					to: path.resolve(__dirname, "../dist"),
					toType: "dir",
					noErrorOnMissing: true, // 不生成错误
					globOptions: {
						// 忽略文件
						ignore: ["**/index.html"],
					},
					info: {
						// 跳过terser压缩js
						minimized: true,
					},
				},
			],
		}),
	],
	mode: "production",
	// devtool: "cheap-module-source-map",
	optimization: {
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				// react react-dom react-router-dom 一起打包成一个文件
				react: {
					test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
					name: `chunk-react`,
					priority: 40,
				},
				// antd 单独打包
				antd: {
					test: /[\\/]node_modules[\\/]antd(.*)?[\\/]/,
					name: `chunk-antd`,
					priority: 30,
				},
				// 剩下的node_modules单独打包
				libs: {
					test: /[\\/]node_modules[\\/]/,
					name: `chunk-libs`,
					priority: 20,
				},
			},
		},
		runtimeChunk: {
			name: entrypoint => `runtime~${entrypoint.name}.js`,
		},
		minimizer: [new CssMinimizerPlugin(), new TerserWebpackPlugin()],
	},
	// webpack解析模块加载选项
	resolve: {
		// 自动补全文件扩展名
		extensions: [".jsx", ".js", ".json"],
	},
	performance: false, // 关闭性能分析，提示速度
};

module.exports = config;
