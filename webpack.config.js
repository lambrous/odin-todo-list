const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
	},
	devtool: "inline-source-map",
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
	],
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
};

module.exports = () => {
	if (isProduction) {
		config.mode = "production";
		config.plugins.push(new MiniCssExtractPlugin());
	} else {
		config.mode = "development";
	}
	return config;
};
