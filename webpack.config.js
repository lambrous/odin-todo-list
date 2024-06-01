const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isProduction = process.env.NODE_ENV === "production";

const stylesHandler = isProduction
	? MiniCssExtractPlugin.loader
	: "style-loader";

const config = {
	entry: "./src/app.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].[contenthash].js",
		clean: true,
	},
	devServer: {
		open: true,
		host: "localhost",
		watchFiles: ["src/index.html"],
	},
	devtool: isProduction ? "source-map" : "inline-source-map",
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			favicon: "./src/assets/favicon.png",
		}),
		new CleanWebpackPlugin(),
		isProduction &&
			new MiniCssExtractPlugin({
				filename: "[name].[contenthash].css",
			}),
		isProduction &&
			new BundleAnalyzerPlugin({
				analyzerMode: "static",
				openAnalyzer: false,
			}),
	].filter(Boolean),
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [stylesHandler, "css-loader"],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|jpeg|gif)$/i,
				type: "asset",
			},
		],
	},
	optimization: {
		splitChunks: {
			chunks: "all",
		},
		usedExports: true,
	},
	resolve: {
		extensions: [".js"],
	},
};

module.exports = () => {
	if (isProduction) {
		config.mode = "production";
	} else {
		config.mode = "development";
	}
	return config;
};
