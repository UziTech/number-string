import {
	toNumber,
	toClean,
	toMoney,
	toClosest,
} from "../src/app";

describe("toNumber", function() {
	it("Positive Number", function() {
		expect(toNumber(2)).toBe(2);
	});
	it("Negative Number", function() {
		expect(toNumber(-2)).toBe(-2);
	});
	it("NaN", function() {
		expect(toNumber(NaN)).toBeNaN();
	});
	it("Infinity", function() {
		expect(toNumber(Infinity)).toBe(Infinity);
	});
	it("-Infinity", function() {
		expect(toNumber(-Infinity)).toBe(-Infinity);
	});
	it("Positive String", function() {
		expect(toNumber("2")).toBe(2);
	});
	it("Negative - String", function() {
		expect(toNumber("-2")).toBe(-2);
	});
	it("Negative () String", function() {
		expect(toNumber("(2)")).toBe(-2);
	});
	it("Other Chars", function() {
		expect(toNumber("a2g")).toBe(2);
	});
	it("Single Decimal", function() {
		expect(toNumber("2.1")).toBe(2.1);
	});
	it("Multiple Decimal", function() {
		expect(toNumber("2.1.2")).toBe(21.2);
	});
	it("No Numbers", function() {
		expect(toNumber("asdf")).toBeNaN();
	});
	it("Array", function() {
		// @ts-expect-error invalid argument type
		expect(toNumber([1, 2, 3])).toBeNaN();
	});
	it("Change Decimal Mark", function() {
		expect(toNumber("2,2", { decimalMark: "," })).toBe(2.2);
	});
});

describe("toClean", function() {
	it("Positive Number", function() {
		expect(toClean(2.0)).toBe("2");
	});
	it("Negative Number", function() {
		expect(toClean(-2.0)).toBe("-2");
	});
	it("NaN", function() {
		expect(toClean(NaN)).toBe("NaN");
	});
	it("Infinity", function() {
		expect(toClean(Infinity)).toBe("Infinity");
	});
	it("-Infinity", function() {
		expect(toClean(-Infinity)).toBe("-Infinity");
	});
	it("Positive String", function() {
		expect(toClean("2.0")).toBe("2");
	});
	it("Single Decimal", function() {
		expect(toClean("2.10")).toBe("2.1");
	});
	it("Array", function() {
		// @ts-expect-error invalid argument type
		expect(toClean([1, 2, 3])).toBe("NaN");
	});

	it("Change Decimal Mark", function() {
		expect(toClean(1234.5, { decimalMark: "," })).toBe("1,234,5");
	});
	it("Change Deprecated Thousands Seperator", function() {
		expect(toClean(1234.5, { thousandSeperator: "." })).toBe("1.234.5");
	});
	it("Change Thousands Separator", function() {
		expect(toClean(1234.5, { thousandSeparator: "." })).toBe("1.234.5");
	});
	it("Change Max Precision", function() {
		expect(toClean(1234.5, { maxPrecision: 0 })).toBe("1,235");
	});
	it("Change Min Precision", function() {
		expect(toClean(1234.5, { minPrecision: 3 })).toBe("1,234.500");
	});
	it("Change Min Precision No Decimal", function() {
		expect(toClean(1234, { minPrecision: 3 })).toBe("1,234.000");
	});

	it("Max Precision < 0", function() {
		expect(toClean(1234, { maxPrecision: -1 })).toBe("1,234");
	});
	it("Max Precision > 10", function() {
		expect(toClean(1234.12345678901, { maxPrecision: 11 })).toBe("1,234.123456789");
	});
	it("Min Precision < 0", function() {
		expect(toClean(1234, { minPrecision: -1 })).toBe("1,234");
	});
	it("Min Precision > 10", function() {
		expect(toClean(1234.5, { minPrecision: 11 })).toBe("1,234.5000000000");
	});
	it("minPrecision > maxPrecision Error", function() {
		expect(() => { toClean(1234, { minPrecision: 3, maxPrecision: 2 }); }).toThrow();
	});
});

describe("toMoney", function() {
	it("Positive Number", function() {
		expect(toMoney(1234.5)).toBe("$1,234.50");
	});
	it("Negative Number", function() {
		expect(toMoney(-1234.5)).toBe("($1,234.50)");
	});
	//it('Negative Number Rounding Error', function () {
	//    expect(toMoney(-.005)).toBe("$0.00"); //FIXME: actual: "($0.01)"
	//});
	it("Positive String", function() {
		expect(toMoney("1234.5")).toBe("$1,234.50");
	});
	it("Negative String", function() {
		expect(toMoney("-1234.5")).toBe("($1,234.50)");
	});
	it("NaN", function() {
		expect(toMoney(NaN)).toBe("NaN");
	});
	it("Infinity", function() {
		expect(toMoney(Infinity)).toBe("Infinity");
	});
	it("-Infinity", function() {
		expect(toMoney(-Infinity)).toBe("(Infinity)");
	});
	it("Array", function() {
		// @ts-expect-error invalid argument type
		expect(toMoney([1, 2, 3])).toBe("NaN");
	});
	it("Change Decimal Mark", function() {
		expect(toMoney(1234.5, { decimalMark: "," })).toBe("$1,234,50");
	});
	it("Change Deprecated Thousands Seperator", function() {
		expect(toMoney(1234.5, { thousandSeperator: "." })).toBe("$1.234.50");
	});
	it("Change Thousands Separator", function() {
		expect(toMoney(1234.5, { thousandSeparator: "." })).toBe("$1.234.50");
	});
	it("Change Max Precision", function() {
		expect(toMoney(1234.5, { maxPrecision: 0 })).toBe("$1,235");
	});
	it("Change Min Precision", function() {
		expect(toMoney(1234.5, { minPrecision: 3 })).toBe("$1,234.500");
	});
	it("Change Symbol", function() {
		expect(toMoney(1234.5, { symbol: "£" })).toBe("£1,234.50");
	});
	it("Change Symbol Behind", function() {
		expect(toMoney(1234.5, { symbolBehind: true })).toBe("1,234.50 $");
	});
	it("Change Use Parens", function() {
		expect(toMoney(-1234.5, { useParens: false })).toBe("-$1,234.50");
	});
	it("Change Use Parens, -Infinity", function() {
		expect(toMoney(-Infinity, { useParens: false })).toBe("-Infinity");
	});

});

describe("toClosest", function() {
	it("Positive Number", function() {
		expect(toClosest(1234.5, 5)).toBe(1235);
	});
	it("Positive Number Half Up", function() {
		expect(toClosest(1232.5, 5)).toBe(1235);
	});
	it("Negative Number", function() {
		expect(toClosest(-1234.5, 5)).toBe(-1235);
	});
	it("Negative Number Half Up", function() {
		expect(toClosest(-1232.5, 5)).toBe(-1230);
	});
	it("Decimal Number", function() {
		expect(toClosest(1.5, .4)).toBe(1.6);
	});
	it("Floating Point Arithmetic Error", function() {
		expect(toClosest(1.5, .6)).toBe(1.8);
	});
	it("Positive String", function() {
		expect(toClosest("1234.5", 5)).toBe(1235);
	});
	it("NaN", function() {
		expect(toClosest(NaN)).toBeNaN();
	});
	it("Infinity", function() {
		expect(toClosest(Infinity, 5)).toBe(Infinity);
	});
	it("-Infinity", function() {
		expect(toClosest(-Infinity, 5)).toBe(-Infinity);
	});
	it("Array", function() {
		// @ts-expect-error invalid argument type
		expect(toClosest([1, 2, 3], 1)).toBeNaN();
	});

	it("Round To String", function() {
		expect(toClosest(1234.5, "5")).toBe(1235);
	});
	it("Round To NaN", function() {
		expect(() => { toClosest(1234, NaN); }).toThrow();
	});
	it("Round To Ininity", function() {
		expect(toClosest(1234.5, Infinity)).toBe(Infinity);
	});
	it("Round To -Ininity", function() {
		expect(toClosest(1234.5, -Infinity)).toBe(-Infinity);
	});
});
