const path = require("path");

module.exports = {
	entry: "./src/index.tsx",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-react",
							"@babel/preset-typescript",
						],
					},
				},
				exclude: /node_modules/,
			},
		],
	},
};
