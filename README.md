[![Travis](https://img.shields.io/travis/UziTech/number-string.svg?branch=master)](https://travis-ci.org/UziTech/number-string)
[![npm downloads](https://img.shields.io/npm/dm/number-string.svg)](https://www.npmjs.com/package/number-string)
[![npm License](https://img.shields.io/npm/l/number-string.svg)](https://spdx.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/UziTech/number-string.svg)](https://github.com/UziTech/number-string/issues)
[![GitHub stars](https://img.shields.io/github/stars/UziTech/number-string.svg)](https://github.com/UziTech/number-string/stargazers)

 Usage
-------

### .toNumber

Convert a string to number disregarding other characters

```js
var ns = require("number-string");

ns.toNumber("$1.57"); // 1.57
```

Parameters:

```js
ns.toNumber(stringOrNumber, {
  decimalMark = ".",
});
```

### .toClean

Like toFixed but removes trailing 0's

```js
var ns = require("number-string");

ns.toClean(1.5009, {maxPrecision: 2}); // "1.5"
```

Parameters:

```js
ns.toClean(stringOrNumber, {
	decimalMark = ".",
	thousandSeperator = ",",
	maxPrecision = 10,
	minPrecision = 0,
});
```

### .toMoney

Converts number to currency

```js
var ns = require("number-string");

ns.toMoney(-1234.5); // "($1,234.50)"
```

Parameters:

```js
ns.toMoney(stringOrNumber, {
	decimalMark = ".",
	thousandSeperator = ",",
	maxPrecision = 2,
	minPrecision = 2,
	symbol = "$",
	symbolBehind = false,
	useParens = true,
});
```

### .toClosest

Rounds to the closest interval

```js
var ns = require("number-string");

ns.toClosest(12.6, 7.1); // 14.2
```

Parameters:

```js
ns.toClosest(stringOrNumber, roundToNearestNumber);
```
