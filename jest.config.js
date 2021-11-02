module.exports = {
	preset: "ts-jest",
	globals: {
		"ts-jest": {
			tsconfig: "./tsconfig.json",
		},
	},
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	},
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	testRegex: "((\\.|/)(test))\\.ts?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
