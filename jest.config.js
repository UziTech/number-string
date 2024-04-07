module.exports = {
	preset: "ts-jest",
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	},
	testRegex: "((\\.|/)(test))\\.ts?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
