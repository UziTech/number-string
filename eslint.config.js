const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");

module.exports = [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2022,
				...globals.jest,
			},
			parserOptions: {
				sourceType: "module",
				ecmaVersion: 2022,
				ecmaFeatures: {
					impliedStrict: true,
				},
			},
		},
		rules: {
			"indent": [
				"error",
				"tab"
			],
			"linebreak-style": [
				"error",
				"unix"
			],
			"quotes": [
				"error",
				"double"
			],
			"semi": [
				"error",
				"always"
			],
			"no-var": "error",
			"prefer-const": "error",
			"prefer-rest-params": "off",
			"prefer-template": "warn",

			"@typescript-eslint/no-var-requires": "off",
		},
	},
	{
		ignores: [
			"coverage/",
			"dist/",
		],
	},
];
