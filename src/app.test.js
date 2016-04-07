var assert = require('assert');
var ns = require('./app.js');

describe('toNumber', function () {
    it('Positive Number', function () {
        assert.strictEqual(ns.toNumber(2), 2);
    });
    it('Negative Number', function () {
        assert.strictEqual(ns.toNumber(-2), -2);
    });
    it('NaN', function () {
        assert.ok(isNaN(ns.toNumber(NaN)));
    });
    it('Infinity', function () {
        assert.strictEqual(ns.toNumber(Infinity), Infinity);
    });
    it('-Infinity', function () {
        assert.strictEqual(ns.toNumber(-Infinity), -Infinity);
    });
    it('Positive String', function () {
        assert.strictEqual(ns.toNumber("2"), 2);
    });
    it('Negative - String', function () {
        assert.strictEqual(ns.toNumber("-2"), -2);
    });
    it('Negative () String', function () {
        assert.strictEqual(ns.toNumber("(2)"), -2);
    });
    it('Other Chars', function () {
        assert.strictEqual(ns.toNumber("a2g"), 2);
    });
    it('Single Decimal', function () {
        assert.strictEqual(ns.toNumber("2.1"), 2.1);
    });
    it('Multiple Decimal', function () {
        assert.strictEqual(ns.toNumber("2.1.2"), 21.2);
    });
    it('No Numbers', function () {
        assert.ok(isNaN(ns.toNumber("asdf")));
    });
    it('Array', function () {
        assert.ok(isNaN(ns.toNumber([1, 2, 3])));
    });
    it('Change Decimal Mark', function () {
        assert.strictEqual(ns.toNumber("2,2", {decimalMark: ","}), 2.2);
    });
});

describe('toClean', function () {
    it('Positive Number', function () {
        assert.strictEqual(ns.toClean(2.0), "2");
    });
    it('Negative Number', function () {
        assert.strictEqual(ns.toClean(-2.0), "-2");
    });
    it('NaN', function () {
        assert.ok(isNaN(ns.toClean(NaN)));
    });
    it('Infinity', function () {
        assert.strictEqual(ns.toClean(Infinity), "Infinity");
    });
    it('-Infinity', function () {
        assert.strictEqual(ns.toClean(-Infinity), "-Infinity");
    });
    it('Positive String', function () {
        assert.strictEqual(ns.toClean("2.0"), "2");
    });
    it('Single Decimal', function () {
        assert.strictEqual(ns.toClean("2.10"), "2.1");
    });
    it('Array', function () {
        assert.strictEqual(ns.toClean([1, 2, 3]), "NaN");
    });

    it('Change Decimal Mark', function () {
        assert.strictEqual(ns.toClean(1234.5, {decimalMark: ","}), "1,234,5");
    });
    it('Change Thousands Seperator', function () {
        assert.strictEqual(ns.toClean(1234.5, { thousandSeperator: "." }), "1.234.5");
    });
    it('Change Max Precision', function () {
        assert.strictEqual(ns.toClean(1234.5, { maxPrecision: 0 }), "1,235");
    });
    it('Change Min Precision', function () {
        assert.strictEqual(ns.toClean(1234.5, { minPrecision: 3 }), "1,234.500");
    });
});

describe('toMoney', function () {
    it('Positive Number', function () {
        assert.strictEqual(ns.toMoney(1234.5), "$1,234.50");
    });
    it('Negative Number', function () {
        assert.strictEqual(ns.toMoney(-1234.5), "($1,234.50)");
    });
    //it('Negative Number Rounding Error', function () {
    //    assert.strictEqual(ns.toMoney(-.005), "$0.00"); //FIXME: actual: "($0.01)"
    //});
    it('Positive String', function () {
        assert.strictEqual(ns.toMoney("1234.5"), "$1,234.50");
    });
    it('Negative String', function () {
        assert.strictEqual(ns.toMoney("-1234.5"), "($1,234.50)");
    });
    it('NaN', function () {
        assert.strictEqual(ns.toMoney(NaN), "NaN");
    });
    it('Infinity', function () {
        assert.strictEqual(ns.toMoney(Infinity), "Infinity");
    });
    it('-Infinity', function () {
        assert.strictEqual(ns.toMoney(-Infinity), "(Infinity)");
    });
    it('Array', function () {
        assert.strictEqual(ns.toMoney([1, 2, 3]), "NaN");
    });
    it('Change Decimal Mark', function () {
        assert.strictEqual(ns.toMoney(1234.5, { decimalMark: "," }), "$1,234,50");
    });
    it('Change Thousands Seperator', function () {
        assert.strictEqual(ns.toMoney(1234.5, { thousandSeperator: "." }), "$1.234.50");
    });
    it('Change Max Precision', function () {
        assert.strictEqual(ns.toMoney(1234.5, { maxPrecision: 0 }), "$1,235");
    });
    it('Change Min Precision', function () {
        assert.strictEqual(ns.toMoney(1234.5, { minPrecision: 3 }), "$1,234.500");
    });
    it('Change Symbol', function () {
        assert.strictEqual(ns.toMoney(1234.5, { symbol: "£" }), "£1,234.50");
    });
    it('Change Symbol Behind', function () {
        assert.strictEqual(ns.toMoney(1234.5, { symbolBehind: true }), "1,234.50 $");
    });

});

describe('toClosest', function () {
    it('Positive Number', function () {
        assert.strictEqual(ns.toClosest(1234.5, 5), 1235);
    });
    it('Positive Number Half Up', function () {
        assert.strictEqual(ns.toClosest(1232.5, 5), 1235);
    });
    it('Negative Number', function () {
        assert.strictEqual(ns.toClosest(-1234.5, 5), -1235);
    });
    it('Negative Number Half Up', function () {
        assert.strictEqual(ns.toClosest(-1232.5, 5), -1230);
    });
    it('Decimal Number', function () {
        assert.strictEqual(ns.toClosest(1.5, .4), 1.6);
    });
    //it('Floating Point Arithmetic Error', function () {
    //    assert.strictEqual(ns.toClosest(1.5, .6), 1.8);// FIXME: actual: 1.7999999999999998
    //});
    it('Positive String', function () {
        assert.strictEqual(ns.toClosest("1234.5", 5), 1235);
    });
    it('NaN', function () {
        assert.ok(isNaN(ns.toClosest(NaN)));
    });
    it('Infinity', function () {
        assert.strictEqual(ns.toClosest(Infinity, 5), Infinity);
    });
    it('-Infinity', function () {
        assert.strictEqual(ns.toClosest(-Infinity, 5), -Infinity);
    });
    it('Array', function () {
        assert.ok(isNaN(ns.toClosest([1, 2, 3], 1)));
    });
});
