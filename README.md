[![Actions Status](https://github.com/UziTech/number-string/workflows/CI/badge.svg)](https://github.com/UziTech/number-string/actions)
[![npm downloads](https://img.shields.io/npm/dm/number-string.svg)](https://www.npmjs.com/package/number-string)
[![npm License](https://img.shields.io/npm/l/number-string.svg)](https://spdx.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/UziTech/number-string.svg)](https://github.com/UziTech/number-string/issues)
[![GitHub stars](https://img.shields.io/github/stars/UziTech/number-string.svg)](https://github.com/UziTech/number-string/stargazers)

 Usage
-------

### .toNumber

Convert a string to number disregarding other characters

```js
import { toNumber } from "number-string";

toNumber("$1.57"); // 1.57
```

Parameters:

```js
toNumber(stringOrNumber, {
  decimalMark = ".",
});
```

### .toNumberString

Convert a string to string of the numbers disregarding other characters

```js
import { toNumberString } from "number-string";

toNumberString("$1.57"); // "1.57"
```

Parameters:

```js
toNumberString(stringOrNumber, {
  decimalMark = ".",
});
```

### .toClean

Like toFixed but removes trailing 0's

```js
import { toClean } from "number-string";

toClean(1.5009, {maxPrecision: 2}); // "1.5"
```

Parameters:

```js
toClean(stringOrNumber, {
	decimalMark = ".",
	thousandSeparator = ",",
	maxPrecision = 10, // maximum precision possible is 10 to prevent floating point errors
	minPrecision = 0,
});
```

### .toMoney

Converts number to currency

```js
import { toMoney } from "number-string";

toMoney(-1234.5); // "($1,234.50)"
```

Parameters:

```js
toMoney(stringOrNumber, {
	decimalMark = ".",
	thousandSeparator = ",",
	maxPrecision = 2, // maximum precision possible is 10 to prevent floating point errors
	minPrecision = 2,
	symbol = "$",
	symbolBehind = false,
	useParens = true,
});
```

### .toClosest

Rounds to the closest interval

```js
import { toClosest } from "number-string";

toClosest(12.6, 7.1); // 14.2
```

Parameters:

```js
toClosest(stringOrNumber, roundToNearestNumber);
```
