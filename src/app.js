function defProp(prop, def) {
    if (typeof prop === "undefined") {
        return def;
    }
    return prop;
}
function regexpEscape(s) {
    return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/, "\\$&");
}
exports.toNumber = function (string, options) {
    if (typeof string === "number") {
        return string;
    }
    if (typeof string !== "string") {
        return NaN;
    }
    options = defProp(options, {});
    decimalMark = defProp(options.decimalMark, ".");
    regexpDecimalMark = regexpEscape(decimalMark);
    var n = string.trim();
    var negative = n.match(/^\(.*\)$|^-/);//negative if matches '(...)' or '-...'
    var getNumberRegexp = new RegExp("[^\\d" + regexpDecimalMark + "]|" + regexpDecimalMark + "(?=.*" + regexpDecimalMark + ")|^\\D*" + regexpDecimalMark + "\\D*$", "g");
    n = n.replace(getNumberRegexp, "").replace(decimalMark, ".");//remove all except digits and last dot
    if (n === "") {
        n = NaN;
    } else if (negative) {
        n = -n;
    }
    return Number(n);
};

exports.toClean = function (number, options) {// 1.500000 -> 1.5; 1.0000 -> 1
    if (typeof number !== "number") {
        number = this.toNumber(number, options);
    }
    if (isNaN(number)) {
        return "NaN";
    }
    
    options = defProp(options, {});
    decimalMark = defProp(options.decimalMark, ".");
    thousandSeperator = defProp(options.thousandSeperator, ",");
    maxPrecision = defProp(options.maxPrecision, 20);
    minPrecision = defProp(options.minPrecision, 0);
    
    maxPrecision = (maxPrecision > 10 ? 10 : (maxPrecision < 0 ? 0 : maxPrecision));
    minPrecision = (minPrecision < 0 ? 0 : (minPrecision > 10 ? 10 : minPrecision));
    if (minPrecision > maxPrecision) {
        throw Error("minPrecision must be <= maxPrecision");
    }
    var n = number;
    
    //limit to maxPrecision
    n = String(+n.toFixed(maxPrecision));
    var dotIndex = n.lastIndexOf(".");
    if (dotIndex > -1) {
        n = n.slice(0, dotIndex) + decimalMark + n.slice(dotIndex + 1);
    } else {
        n += decimalMark;
    }
    //limit to minPrecision
    if (minPrecision > 0) {
        var numZeros;
        if (dotIndex > -1) {
            numZeros = minPrecision - (n.length - dotIndex - 1);
        } else {
            numZeros = minPrecision;
        }
        for (var i = 0; i < numZeros; i++) {
            n += "0";
        }
    }
    regexpDecimalMark = regexpEscape(decimalMark);
    thousandSeperatorRegexp = new RegExp("\\d(?=(\\d{3})+" + regexpDecimalMark + ")", "g");
    trimRegexp = new RegExp(regexpDecimalMark + "$");
    n = n.replace(thousandSeperatorRegexp, "$&" + thousandSeperator).replace(trimRegexp, "");
    
    return n;
};

//modified from http://stackoverflow.com/a/149099/806777
exports.toMoney = function (number, options) { // -1234.56 -> ($1,234.56)
    if (typeof number !== "number") {
        number = this.toNumber(number, options);
    }
    if (isNaN(number)) {
        return "NaN";
    }
    if (number === Infinity) {
        return "Infinity";
    }
    if (number === -Infinity) {
        return "(Infinity)";
    }
    options = defProp(options, {});
    decimalMark = defProp(options.decimalMark, ".");
    thousandSeperator = defProp(options.thousandSeperator, ",");
    maxPrecision = defProp(options.maxPrecision, 2);
    minPrecision = defProp(options.minPrecision, 2);
    if (maxPrecision < 2 && typeof options.minPrecision === "undefined") {
        minPrecision = maxPrecision;
    }
    if (minPrecision > 2 && typeof options.maxPrecision === "undefined") {
        maxPrecision = minPrecision;
    }
    symbol = defProp(options.symbol, "$");
    symbolBehind = defProp(options.symbolBehind, false);
    
    var negative = number < 0;
    var n = Math.abs(number);

    n = this.toClean(n, {
        decimalMark: decimalMark,
        thousandSeperator: thousandSeperator,
        maxPrecision: maxPrecision,
        minPrecision: minPrecision
    });

    n = (symbolBehind? n + " " + symbol: symbol + n);
    if (negative) {
        n = "(" + n + ")";
    }
    return n;
};

exports.toClosest = function (number, roundTo) {
    if (typeof number !== "number") {
        number = this.toNumber(number);
    }
    if (isNaN(number)) {
        return NaN;
    }
    if (number === Infinity || number === -Infinity) {
        return number;
    }
    console.log(roundTo);
    if (typeof roundTo !== "number") {
        roundTo = this.toNumber(roundTo);
    }
    if (isNaN(roundTo)) {
        throw Error("roundTo must be a number");
    }
    if (roundTo === Infinity || roundTo === -Infinity) {
        return roundTo;
    }
    var n = Math.round(number / roundTo) * roundTo;
    
    var maxPrecision = 0;
    while (!Number.isInteger(roundTo)) {
        roundTo *= 10;
        maxPrecision++;
    }
    return +n.toFixed(maxPrecision);
};