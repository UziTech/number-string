﻿[![Travis](https://img.shields.io/travis/UziTech/number-string.svg)](https://travis-ci.org/UziTech/number-string)
[![npm downloads](https://img.shields.io/npm/dm/number-string.svg)](https://www.npmjs.com/package/number-string)
[![npm License](https://img.shields.io/npm/l/number-string.svg)](https://spdx.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/UziTech/number-string.svg)](https://github.com/UziTech/number-string/issues)
[![GitHub stars](https://img.shields.io/github/stars/UziTech/number-string.svg)](https://github.com/UziTech/number-string/stargazers)

 Usage
-------

[![Greenkeeper badge](https://badges.greenkeeper.io/UziTech/number-string.svg)](https://greenkeeper.io/)

### .toNumber

Convert a string to number disregarding other characters

```javascript
var ns = require("number-string");

ns.toNumber("$1.57"); // 1.57
```

### .toClean

Like toFixed but removes trailing 0's

```javascript
var ns = require("number-string");

ns.toClean(1.5009, {maxPrecision: 2}); // "1.5"
```

### .toMoney

Converts number to currency

```javascript
var ns = require("number-string");

ns.toMoney(-1234.5); // "($1234.50)"
```

### .toClosest

Rounds to the closest interval

```javascript
var ns = require("number-string");

ns.toClosest(12.6, 7.1); // 14.2
```
