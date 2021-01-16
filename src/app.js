/**
 * Escape special RegExp characters in string
 * @param  {string} s String to escape
 * @return {string} Escaped string
 */
function regexpEscape(s) {
	return s.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}

/**
 * Convert value to number
 * @param  {string|number} value Value
 * @param  {object} [options={}] Options
 * @param  {string} [options.decimalMark="."] Decimal mark character
 * @return {number} Number
 */
export function toNumber(value, {
	decimalMark = ".",
} = {}) {
	if (typeof value === "number") {
		return value;
	}
	if (typeof value !== "string") {
		return NaN;
	}

	const regexpDecimalMark = regexpEscape(decimalMark);
	let n = value.trim();
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

/**
 * Like `toFixed` but removes trailing zeros
 * @param  {string|number} value Value
 * @param  {object} [options={}] Options
 * @param  {string} [options.decimalMark="."] Decimal mark character
 * @param  {string} [options.thousandSeperator=","] Thousands separator character
 * @param  {number} [options.maxPrecision=10] Maximum number of decimal places
 * @param  {number} [options.minPrecision=0] Minimum number of decimal places
 * @return {string} Cleaned value
 */
export function toClean(value, {
	decimalMark = ".",
	thousandSeperator = ",",
	maxPrecision = 10,
	minPrecision = 0,
} = {}) { // 1.500000 -> 1.5; 1.0000 -> 1
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
	let n = value;

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
	const thousandSeperatorRegexp = new RegExp(`\\d(?=(\\d{3})+${regexpDecimalMark})`, "g");
	const trimRegexp = new RegExp(`${regexpDecimalMark}$`);
	n = n.replace(thousandSeperatorRegexp, `$&${thousandSeperator}`).replace(trimRegexp, "");

	return n;
}

/**
 * Convert string or number to currency string
 * modified from http://stackoverflow.com/a/149099/806777\
 * @param  {string|number} value Value
 * @param  {object} [options={}] Options
 * @param  {string} [options.decimalMark="."] Decimal mark character
 * @param  {string} [options.thousandSeperator=","] Thousands separator character
 * @param  {number} [options.maxPrecision=10] Maximum number of decimal places
 * @param  {number} [options.minPrecision=0] Minimum number of decimal places
 * @param  {string} [options.symbol="$"] Currency symbol character
 * @param  {bool} [options.symbolBehind=false] Place currency symbol behind number
 * @param  {bool} [options.useParens=true] Use parentheses for negative values
 * @return {string} Value to currency string
 */
export function toMoney(value, {
	decimalMark = ".",
	thousandSeperator = ",",
	maxPrecision = 2,
	minPrecision = 2,
	symbol = "$",
	symbolBehind = false,
	useParens = true,
} = {}) { // -1234.56 -> ($1,234.56)
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
	let n = Math.abs(value);

	n = toClean(n, {
		decimalMark,
		thousandSeperator,
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
 * @param  {string|number} value Value
 * @param  {number} [roundTo=1] Round to multiple of this number
 * @return {number} Rounded number
 */
export function toClosest(value, roundTo = 1) {
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

// allows for `import ns from ...`
export default {
	toNumber,
	toClean,
	toMoney,
	toClosest
};
