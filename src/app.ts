/**
 * Escape special RegExp characters in string
 * @param  {string} s String to escape
 * @return {string} Escaped string
 */
function regexpEscape(s: string): string {
	return s.replace(/[-[\]/{}()*+?.\\^$]/g, "\\$&");
}

export interface ToNumberOptions {
	decimalMark?: string
}

/**
 * Convert value to number
 */
export function toNumber(value: string | number, {
	decimalMark = ".",
}: ToNumberOptions = {}): number {
	if (typeof value === "number") {
		return value;
	}
	if (typeof value !== "string") {
		return NaN;
	}

	const regexpDecimalMark = regexpEscape(decimalMark);
	let n: string | number = value.trim();
	const negative = n.match(/^\(.*\)$|^-/); //negative if matches '(...)' or '-...'
	const getNumberRegexp = new RegExp(`[^\\d${regexpDecimalMark}]|${regexpDecimalMark}(?=.*${regexpDecimalMark})|^\\D*${regexpDecimalMark}\\D*$`, "g");
	n = n.replace(getNumberRegexp, "").replace(decimalMark, "."); //remove all except digits and last dot
	if (n === "") {
		n = NaN;
	} else if (negative) {
		n = -n;
	}
	return Number(n);
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
	maxPrecision = 10,
	minPrecision = 0,
}: ToCleanOptions = {}): string { // 1.500000 -> 1.5; 1.0000 -> 1
	if (thousandSeperator) {
		thousandSeparator = thousandSeperator;
		console.error("`thousandSeperator` is deprecated use `thousandSeparator` instead.");
	}
	if (typeof value !== "number") {
		value = toNumber(value, {
			decimalMark
		});
	}
	if (isNaN(value)) {
		return "NaN";
	}

	maxPrecision = (maxPrecision > 10 ? 10 : (maxPrecision < 0 ? 0 : maxPrecision));
	minPrecision = (minPrecision < 0 ? 0 : (minPrecision > 10 ? 10 : minPrecision));
	if (minPrecision > maxPrecision) {
		throw Error("minPrecision must be <= maxPrecision");
	}
	let n: string | number = value;

	//limit to maxPrecision
	n = String(+n.toFixed(maxPrecision));
	const dotIndex = n.lastIndexOf(".");
	if (dotIndex > -1) {
		n = n.slice(0, dotIndex) + decimalMark + n.slice(dotIndex + 1);
	} else {
		n += decimalMark;
	}
	//limit to minPrecision
	if (minPrecision > 0) {
		let numZeros;
		if (dotIndex > -1) {
			numZeros = minPrecision - (n.length - dotIndex - 1);
		} else {
			numZeros = minPrecision;
		}
		for (let i = 0; i < numZeros; i++) {
			n += "0";
		}
	}
	const regexpDecimalMark = regexpEscape(decimalMark);
	const thousandSeparatorRegexp = new RegExp(`\\d(?=(\\d{3})+${regexpDecimalMark})`, "g");
	const trimRegexp = new RegExp(`${regexpDecimalMark}$`);
	n = n.replace(thousandSeparatorRegexp, `$&${thousandSeparator}`).replace(trimRegexp, "");

	return n;
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
	if (typeof value !== "number") {
		value = toNumber(value, {
			decimalMark
		});
	}
	if (isNaN(value)) {
		return "NaN";
	}
	if (value === Infinity) {
		return "Infinity";
	}
	if (value === -Infinity) {
		return (useParens ? "(Infinity)" : "-Infinity");
	}

	if (maxPrecision < 2 && typeof arguments[1].minPrecision === "undefined") {
		minPrecision = maxPrecision;
	}
	if (minPrecision > 2 && typeof arguments[1].maxPrecision === "undefined") {
		maxPrecision = minPrecision;
	}


	const negative = value < 0;
	let n: string | number = Math.abs(value);

	n = toClean(n, {
		decimalMark,
		thousandSeparator,
		maxPrecision,
		minPrecision
	});

	n = (symbolBehind ? `${n} ${symbol}` : symbol + n);
	if (negative) {
		n = (useParens ? `(${n})` : `-${n}`);
	}
	return n;
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
