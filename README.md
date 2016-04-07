# number-string

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