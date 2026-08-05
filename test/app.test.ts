import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
	toNumberString,
	toNumber,
	toClean,
	toMoney,
	toClosest,
} from "../src/app.ts";

describe("toNumberString", function() {
	it("Positive Number", function() {
		assert.strictEqual(toNumberString(2), "2");
	});
	it("Negative Number", function() {
		assert.strictEqual(toNumberString(-2), "-2");
	});
	it("NaN", function() {
		assert.strictEqual(toNumberString(NaN), "NaN");
	});
	it("Infinity", function() {
		assert.strictEqual(toNumberString(Infinity), "Infinity");
	});
	it("-Infinity", function() {
		assert.strictEqual(toNumberString(-Infinity), "-Infinity");
	});
	it("Positive String", function() {
		assert.strictEqual(toNumberString("2"), "2");
	});
	it("Negative - String", function() {
		assert.strictEqual(toNumberString("-2"), "-2");
	});
	it("Negative () String", function() {
		assert.strictEqual(toNumberString("(2)"), "-2");
	});
	it("Other Chars", function() {
		assert.strictEqual(toNumberString("a2g"), "2");
	});
	it("Single Decimal", function() {
		assert.strictEqual(toNumberString("2.1"), "2.1");
	});
	it("Multiple Decimal", function() {
		assert.strictEqual(toNumberString("2.1.2"), "21.2");
	});
	it("No Numbers", function() {
		assert.strictEqual(toNumberString("asdf"), "NaN");
	});
	it("Array", function() {
		// @ts-expect-error invalid argument type
		assert.strictEqual(toNumberString([1, 2, 3]), "NaN");
	});
	it("Change Decimal Mark", function() {
		assert.strictEqual(toNumberString("2,2", { decimalMark: "," }), "2.2");
	});
});

describe("toNumber", function() {
	it("Positive Number", function() {
		assert.strictEqual(toNumber(2), 2);
	});
	it("Negative Number", function() {
		assert.strictEqual(toNumber(-2), -2);
	});
	it("NaN", function() {
		assert.ok(Number.isNaN(toNumber(NaN)));
	});
	it("Infinity", function() {
		assert.strictEqual(toNumber(Infinity), Infinity);
	});
	it("-Infinity", function() {
		assert.strictEqual(toNumber(-Infinity), -Infinity);
	});
	it("Positive String", function() {
		assert.strictEqual(toNumber("2"), 2);
	});
	it("Negative - String", function() {
		assert.strictEqual(toNumber("-2"), -2);
	});
	it("Negative () String", function() {
		assert.strictEqual(toNumber("(2)"), -2);
	});
	it("Other Chars", function() {
		assert.strictEqual(toNumber("a2g"), 2);
	});
	it("Single Decimal", function() {
		assert.strictEqual(toNumber("2.1"), 2.1);
	});
	it("Multiple Decimal", function() {
		assert.strictEqual(toNumber("2.1.2"), 21.2);
	});
	it("No Numbers", function() {
		assert.ok(Number.isNaN(toNumber("asdf")));
	});
	it("Array", function() {
		// @ts-expect-error invalid argument type
		assert.ok(Number.isNaN(toNumber([1, 2, 3])));
	});
	it("Change Decimal Mark", function() {
		assert.strictEqual(toNumber("2,2", { decimalMark: "," }), 2.2);
	});
});

describe("toClean", function() {
	it("Positive Number", function() {
		assert.strictEqual(toClean(2.0), "2");
	});
	it("Negative Number", function() {
		assert.strictEqual(toClean(-2.0), "-2");
	});
	it("NaN", function() {
		assert.strictEqual(toClean(NaN), "NaN");
	});
	it("Infinity", function() {
		assert.strictEqual(toClean(Infinity), "Infinity");
	});
	it("-Infinity", function() {
		assert.strictEqual(toClean(-Infinity), "-Infinity");
	});
	it("Positive String", function() {
		assert.strictEqual(toClean("2.0"), "2");
	});
	it("Single Decimal", function() {
		assert.strictEqual(toClean("2.10"), "2.1");
	});
	it("Array", function() {
		// @ts-expect-error invalid argument type
		assert.strictEqual(toClean([1, 2, 3]), "NaN");
	});

	it("Change Decimal Mark", function() {
		assert.strictEqual(toClean(1234.5, { decimalMark: "," }), "1,234,5");
	});
	it("Change Deprecated Thousands Seperator", function() {
		assert.strictEqual(toClean(1234.5, { thousandSeperator: "." }), "1.234.5");
	});
	it("Change Thousands Separator", function() {
		assert.strictEqual(toClean(1234.5, { thousandSeparator: "." }), "1.234.5");
	});
	it("Change Max Precision", function() {
		assert.strictEqual(toClean(1234.5, { maxPrecision: 0 }), "1,235");
	});
	it("Change Min Precision", function() {
		assert.strictEqual(toClean(1234.5, { minPrecision: 3 }), "1,234.500");
	});
	it("Change Min Precision No Decimal", function() {
		assert.strictEqual(toClean(1234, { minPrecision: 3 }), "1,234.000");
	});
	it("Big Max Precision", function() {
		assert.strictEqual(toClean("1,234.1234567890123456789012345678901", { maxPrecision: 30 }), "1,234.12345678901234567890123456789");
	});
	it("Big Max Precision rounding", function() {
		assert.strictEqual(toClean("1,234.1234567890123456789012345678901", { maxPrecision: 18 }), "1,234.123456789012345679");
	});
	it("Big Min Precision", function() {
		assert.strictEqual(toClean("1,234.12345678901234567890123456789", { minPrecision: 30 }), "1,234.123456789012345678901234567890");
	});

	it("no integer", function() {
		assert.strictEqual(toClean(".1234500"), "0.12345");
	});

	it("Max Precision < 0", function() {
		assert.throws(() => { toClean(1234.5, { maxPrecision: -1 }); }, { message: "maxPrecision must be >= 0" });
	});
	it("Max Precision > 100", function() {
		assert.throws(() => { toClean(1234.5, { maxPrecision: 101 }); }, { message: "maxPrecision must be <= 100" });
	});
	it("Min Precision < 0", function() {
		assert.throws(() => { toClean(1234.5, { minPrecision: -1 }); }, { message: "minPrecision must be >= 0" });
	});
	it("Min Precision > 100", function() {
		assert.throws(() => { toClean(1234.5, { minPrecision: 101 }); }, { message: "minPrecision must be <= 100" });
	});
	it("minPrecision > maxPrecision Error", function() {
		assert.throws(() => { toClean(1234, { minPrecision: 3, maxPrecision: 2 }); }, { message: "minPrecision must be <= maxPrecision" });
	});
});

describe("toMoney", function() {
	it("Positive Number", function() {
		assert.strictEqual(toMoney(1234.5), "$1,234.50");
	});
	it("Negative Number", function() {
		assert.strictEqual(toMoney(-1234.5), "($1,234.50)");
	});
	//it('Negative Number Rounding Error', function () {
	//    assert.strictEqual(toMoney(-.005), "$0.00"); //FIXME: actual: "($0.01)"
	//});
	it("Positive String", function() {
		assert.strictEqual(toMoney("1234.5"), "$1,234.50");
	});
	it("Negative String", function() {
		assert.strictEqual(toMoney("-1234.5"), "($1,234.50)");
	});
	it("NaN", function() {
		assert.strictEqual(toMoney(NaN), "NaN");
	});
	it("Infinity", function() {
		assert.strictEqual(toMoney(Infinity), "Infinity");
	});
	it("-Infinity", function() {
		assert.strictEqual(toMoney(-Infinity), "(Infinity)");
	});
	it("Array", function() {
		// @ts-expect-error invalid argument type
		assert.strictEqual(toMoney([1, 2, 3]), "NaN");
	});
	it("Change Decimal Mark", function() {
		assert.strictEqual(toMoney(1234.5, { decimalMark: "," }), "$1,234,50");
	});
	it("Change Deprecated Thousands Seperator", function() {
		assert.strictEqual(toMoney(1234.5, { thousandSeperator: "." }), "$1.234.50");
	});
	it("Change Thousands Separator", function() {
		assert.strictEqual(toMoney(1234.5, { thousandSeparator: "." }), "$1.234.50");
	});
	it("Change Max Precision", function() {
		assert.strictEqual(toMoney(1234.5, { maxPrecision: 0 }), "$1,235");
	});
	it("Big Max Precision", function() {
		assert.strictEqual(toMoney("1234.1234567890123456789012345678901", { maxPrecision: 30 }), "$1,234.12345678901234567890123456789");
	});
	it("Change Min Precision", function() {
		assert.strictEqual(toMoney(1234.5, { minPrecision: 3 }), "$1,234.500");
	});
	it("Big Min Precision", function() {
		assert.strictEqual(toMoney(1234.5, { minPrecision: 30 }), "$1,234.500000000000000000000000000000");
	});
	it("Change Symbol", function() {
		assert.strictEqual(toMoney(1234.5, { symbol: "£" }), "£1,234.50");
	});
	it("Change Symbol Behind", function() {
		assert.strictEqual(toMoney(1234.5, { symbolBehind: true }), "1,234.50 $");
	});
	it("Change Use Parens", function() {
		assert.strictEqual(toMoney(-1234.5, { useParens: false }), "-$1,234.50");
	});
	it("Change Use Parens, -Infinity", function() {
		assert.strictEqual(toMoney(-Infinity, { useParens: false }), "-Infinity");
	});

});

describe("toClosest", function() {
	it("Positive Number", function() {
		assert.strictEqual(toClosest(1234.5, 5), 1235);
	});
	it("Positive Number Half Up", function() {
		assert.strictEqual(toClosest(1232.5, 5), 1235);
	});
	it("Negative Number", function() {
		assert.strictEqual(toClosest(-1234.5, 5), -1235);
	});
	it("Negative Number Half Up", function() {
		assert.strictEqual(toClosest(-1232.5, 5), -1230);
	});
	it("Decimal Number", function() {
		assert.strictEqual(toClosest(1.5, .4), 1.6);
	});
	it("Floating Point Arithmetic Error", function() {
		assert.strictEqual(toClosest(1.5, .6), 1.8);
	});
	it("Positive String", function() {
		assert.strictEqual(toClosest("1234.5", 5), 1235);
	});
	it("NaN", function() {
		assert.ok(Number.isNaN(toClosest(NaN)));
	});
	it("Infinity", function() {
		assert.strictEqual(toClosest(Infinity, 5), Infinity);
	});
	it("-Infinity", function() {
		assert.strictEqual(toClosest(-Infinity, 5), -Infinity);
	});
	it("Array", function() {
		// @ts-expect-error invalid argument type
		assert.ok(Number.isNaN(toClosest([1, 2, 3], 1)));
	});

	it("Round To String", function() {
		assert.strictEqual(toClosest(1234.5, "5"), 1235);
	});
	it("Round To NaN", function() {
		assert.throws(() => { toClosest(1234, NaN); });
	});
	it("Round To Ininity", function() {
		assert.strictEqual(toClosest(1234.5, Infinity), Infinity);
	});
	it("Round To -Ininity", function() {
		assert.strictEqual(toClosest(1234.5, -Infinity), -Infinity);
	});
});
