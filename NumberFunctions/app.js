
//modified from http://stackoverflow.com/a/149099/806777
exports.toMoney = function (number, decimalSeperator, thousandSeperator, maxPrecision) { // -1234.56 -> ($1,234.56)
    if (typeof number !== "Number") {
        number = this.toNumber(number);
    }
    if (isNaN(number)) {
        return "NaN";
    }
    decimalSeperator = decimalSeperator || ".";
    thousandSeperator = thousandSeperator || ",";
    maxPrecision = maxPrecision || 2;
    maxPrecision = (maxPrecision > 20 ? 20 : (maxPrecision < 0 ? 0 : maxPrecision));
    var negative = number < 0;
    var n = Math.abs(number);
    
    n = this.toClean(n, maxPrecision, 2);
    n = "$" + n.replace(/\d(?=(\d{3})+\.)/g, "$&,");
    if (negative) {
        n = "(" + n + ")";
    }
    return n;
};

exports.toClean = function (number, maxPrecision, minPrecision) {// 1.500000 -> 1.5; 1.0000 -> 1
    if (typeof number !== "Number") {
        number = this.toNumber(number);
    }
    if (isNaN(number)) {
        return "NaN";
    }
    maxPrecision = maxPrecision || 20;
    maxPrecision = (maxPrecision > 20 ? 20 : (maxPrecision < 0 ? 0 : maxPrecision));
    minPrecision = minPrecision || 0;
    minPrecision = (minPrecision < 0 ? 0 : (minPrecision > 20 ? 20 : minPrecision));
    if (minPrecision > maxPrecision) {
        var temp = maxPrecision;
        maxPrecision = minPrecision;
        minPrecision = temp;
    }
    var n = number;
    
    //limit to maxPrecision
    n = new String(+(n.toFixed(maxPrecision)));
    
    //limit to minPrecision
    if (minPrecision > 0) {
        var numZeros;
        var dotIndex = n.indexOf(".");
        if (dotIndex > -1) {
            numZeros = minPrecision - (n.length - dotIndex - 1);
        } else {
            numZeros = minPrecision;
            n += ".";
        }
        for (var i = 0; i < numZeros; i++) {
            n += "0";
        }
    }
    
    return n;
};

exports.toClosest = function (number, roundTo) {
    if (typeof number !== "Number") {
        number = this.toNumber(number);
    }
    if (isNaN(number)) {
        return "NaN";
    }
    var remainder = number % roundTo;
    var n = number - remainder;
    if (remainder >= roundTo / 2) {
        n += roundTo;
    }
    return n;
};

exports.toNumber = function (string, decimalSeperator) {
    if (typeof string === "Number") {
        return string;
    }
    if (typeof string !== "String") {
        return NaN;
    }
    decimalSeperator = decimalSeperator || ".";
    regexpDecimalSeperator = decimalSeperator.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/, "\\$&");
    var n = string.trim();
    var negative = n.match(/^\(.*\)$|^-/);//negative if matches '(...)' or '-...'
    var getNumberRegexp = new RegExp("[^\d" + regexpDecimalSeperator + "]|" + regexpDecimalSeperator + "(?=.*" + regexpDecimalSeperator + ")", "g");
    n = n.replace(getNumberRegexp, "");//remove all except digits and last dot
    if (n === decimalSeperator || n === "") {
        n = NaN;
    } else if (negative) {
        n = -n;
    }
    return new Number(n);
};