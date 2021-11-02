/**
 * Escape special RegExp characters in string
 */
function regexpEscape(s: string): string {
	return s.replace(/[-[\]/{}()*+?.\\^$]/g, "\\$&");
}

export interface ToNumberOptions {
	decimalMark?: string
}

/**
 * Convert value to number string
 */
export function toNumberString(value: string | number, {
	decimalMark = ".",
}: ToNumberOptions = {}): string {
	if (typeof value === "number") {
		return value.toString();
	}
	if (typeof value !== "string") {
		return "NaN";
	}

	const regexpDecimalMark = regexpEscape(decimalMark);
	let n = value.trim();
	const negative = n.match(/^\(.*\)$|^-/); //negative if matches '(...)' or '-...'
	const getNumberRegexp = new RegExp(`[^\\d${regexpDecimalMark}]|${regexpDecimalMark}(?=.*${regexpDecimalMark})|^\\D*${regexpDecimalMark}\\D*$`, "g");
	n = n.replace(getNumberRegexp, "").replace(decimalMark, "."); //remove all except digits and last dot
	if (n === "") {
		n = "NaN";
	} else if (negative) {
		n = `-${n}`;
	}
	return n;
}

/**
 * Convert value to number
 */
export function toNumber(value: string | number, {
	decimalMark = ".",
}: ToNumberOptions = {}): number {
	const s = toNumberString(value, { decimalMark });
	if (s === "NaN") {
		return NaN;
	}
	return Number(s);
}

export interface ToCleanOptions {
	decimalMark?: string
	/** @deprecated use thousandSeparator instead. */
	thousandSeperator?: string | null
	thousandSeparator?: string
	maxPrecision?: number
	minPrecision?: number
}

/**
 * Like `toFixed` but removes trailing zeros
 */
export function toClean(value: string | number, {
	decimalMark = ".",
	thousandSeperator = null,
	thousandSeparator = ",",
	maxPrecision = 100,
	minPrecision = 0,
}: ToCleanOptions = {}): string { // 1.500000 -> 1.5; 1.0000 -> 1
	if (thousandSeperator) {
		thousandSeparator = thousandSeperator;
		console.error("`thousandSeperator` is deprecated use `thousandSeparator` instead.");
	}
	value = toNumberString(value);
	if (value === "NaN") {
		return "NaN";
	}

	if (maxPrecision < 0) {
		throw new Error("maxPrecision must be >= 0");
	}
	if (minPrecision < 0) {
		throw new Error("minPrecision must be >= 0");
	}
	if (maxPrecision > 100) {
		throw new Error("maxPrecision must be <= 100");
	}
	if (minPrecision > 100) {
		throw new Error("minPrecision must be <= 100");
	}
	if (minPrecision > maxPrecision) {
		throw new Error("minPrecision must be <= maxPrecision");
	}
	let s = value;


	// limit to maxPrecision
	const dotIndex = s.lastIndexOf(".");

	if (dotIndex > -1) {
		let integer = (dotIndex === 0 ? "0" : s.slice(0, dotIndex));
		let fraction = s.slice(dotIndex + 1, dotIndex + 1 + maxPrecision);
		const remainder = s.slice(dotIndex + 1 + maxPrecision);
		if (remainder.length > 0 && +remainder[0] > 4) {
			// round up
			const i = (BigInt(integer + fraction) + BigInt(1)).toString(10);
			integer = i.slice(0, i.length - fraction.length);
			fraction = i.slice(i.length - fraction.length);
		}
		s = integer + decimalMark + fraction;
	} else {
		s += decimalMark;
	}
	// remove trailing 0s
	let rmLen = 0;
	for (let i = s.length - 1; i >= 0; i--) {
		if (s[i] !== "0") {
			break;
		}
		rmLen++;
	}
	s = s.slice(0, s.length - rmLen);
	// limit to minPrecision
	if (minPrecision > 0) {
		let numZeros;
		if (dotIndex > -1) {
			numZeros = minPrecision - (s.length - dotIndex - 1);
		} else {
			numZeros = minPrecision;
		}
		for (let i = 0; i < numZeros; i++) {
			s += "0";
		}
	}
	const regexpDecimalMark = regexpEscape(decimalMark);
	const thousandSeparatorRegexp = new RegExp(`\\d(?=(\\d{3})+${regexpDecimalMark})`, "g");
	const trimRegexp = new RegExp(`${regexpDecimalMark}$`);
	s = s.replace(thousandSeparatorRegexp, `$&${thousandSeparator}`).replace(trimRegexp, "");

	return s;
}

export interface ToMoneyOptions {
	decimalMark?: string
	/** @deprecated use thousandSeparator instead. */
	thousandSeperator?: string | null
	thousandSeparator?: string
	maxPrecision?: number
	minPrecision?: number
	symbol?: string
	symbolBehind?: boolean
	useParens?: boolean
}

/**
 * Convert string or number to currency string
 * modified from http://stackoverflow.com/a/149099/806777\
 */
export function toMoney(value: string | number, {
	decimalMark = ".",
	thousandSeperator = null,
	thousandSeparator = ",",
	maxPrecision = 2,
	minPrecision = 2,
	symbol = "$",
	symbolBehind = false,
	useParens = true,
}: ToMoneyOptions = {}): string { // -1234.56 -> ($1,234.56)
	if (thousandSeperator) {
		thousandSeparator = thousandSeperator;
		console.error("`thousandSeperator` is deprecated use `thousandSeparator` instead.");
	}

	const n = (
		typeof value === "number"
			? value
			: toNumber(value, {
				decimalMark
			})
	);
	let s = toNumberString(value, {
		decimalMark
	});
	if (isNaN(n)) {
		return "NaN";
	}
	if (n === Infinity) {
		return "Infinity";
	}
	if (n === -Infinity) {
		return (useParens ? "(Infinity)" : "-Infinity");
	}

	if (maxPrecision < 2 && typeof arguments[1].minPrecision === "undefined") {
		minPrecision = maxPrecision;
	}
	if (minPrecision > 2 && typeof arguments[1].maxPrecision === "undefined") {
		maxPrecision = minPrecision;
	}


	const negative = n < 0;

	s = toClean(negative ? s.slice(1) : s, {
		decimalMark,
		thousandSeparator,
		maxPrecision,
		minPrecision
	});

	s = (symbolBehind ? `${s} ${symbol}` : symbol + s);
	if (negative) {
		s = (useParens ? `(${s})` : `-${s}`);
	}
	return s;
}

/**
 * Round number to closest multiple of number
 */
export function toClosest(value: string | number, roundTo: string | number = 1): number {
	if (typeof value !== "number") {
		value = toNumber(value);
	}
	if (isNaN(value)) {
		return NaN;
	}
	if (value === Infinity || value === -Infinity) {
		return value;
	}

	if (typeof roundTo !== "number") {
		roundTo = toNumber(roundTo);
	}
	if (isNaN(roundTo)) {
		throw Error("roundTo must be a number");
	}
	if (roundTo === Infinity || roundTo === -Infinity) {
		return roundTo;
	}
	let n = Math.round(value / roundTo) * roundTo;

	let maxPrecision = 0;
	while (!Number.isInteger(roundTo)) {
		roundTo *= 10;
		maxPrecision++;
	}
	n = +n.toFixed(maxPrecision);
	return n;
}
