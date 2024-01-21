// jest.config.js
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.tsx?$": "ts-jest",
		"^.+\\.jsx?$": "babel-jest",
	},
	testRegex: "(/tests/.*\\.(test|spec))\\.[jt]sx?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
