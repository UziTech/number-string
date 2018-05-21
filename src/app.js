function regexpEscape(s) {
	// eslint-disable-next-line no-useless-escape
	return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/, "\\$&");
}


function toNumber(string, {
	decimalMark = ".",
} = {}) {
	if (typeof string === "number") {
		return string;
	}
	if (typeof string !== "string") {
		return NaN;
	}

	const regexpDecimalMark = regexpEscape(decimalMark);
	let n = string.trim();
	const negative = n.match(/^\(.*\)$|^-/); //negative if matches '(...)' or '-...'
	const getNumberRegexp = new RegExp("[^\\d" + regexpDecimalMark + "]|" + regexpDecimalMark + "(?=.*" + regexpDecimalMark + ")|^\\D*" + regexpDecimalMark + "\\D*$", "g");
	n = n.replace(getNumberRegexp, "").replace(decimalMark, "."); //remove all except digits and last dot
	if (n === "") {
		n = NaN;
	} else if (negative) {
		n = -n;
	}
	return Number(n);
}

function toClean(number, {
	decimalMark = ".",
	thousandSeperator = ",",
	maxPrecision = 10,
	minPrecision = 0,
} = {}) { // 1.500000 -> 1.5; 1.0000 -> 1
	if (typeof number !== "number") {
		number = toNumber(number, {
			decimalMark
		});
	}
	if (isNaN(number)) {
		return "NaN";
	}

	maxPrecision = (maxPrecision > 10 ? 10 : (maxPrecision < 0 ? 0 : maxPrecision));
	minPrecision = (minPrecision < 0 ? 0 : (minPrecision > 10 ? 10 : minPrecision));
	if (minPrecision > maxPrecision) {
		throw Error("minPrecision must be <= maxPrecision");
	}
	let n = number;

	//limit to maxPrecision
	n = String(+n.toFixed(maxPrecision));
	let dotIndex = n.lastIndexOf(".");
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
	const thousandSeperatorRegexp = new RegExp("\\d(?=(\\d{3})+" + regexpDecimalMark + ")", "g");
	const trimRegexp = new RegExp(regexpDecimalMark + "$");
	n = n.replace(thousandSeperatorRegexp, "$&" + thousandSeperator).replace(trimRegexp, "");

	return n;
}

//modified from http://stackoverflow.com/a/149099/806777
function toMoney(number, {
	decimalMark = ".",
	thousandSeperator = ",",
	maxPrecision = 2,
	minPrecision = 2,
	symbol = "$",
	symbolBehind = false,
	useParens = true,
} = {}) { // -1234.56 -> ($1,234.56)
	if (typeof number !== "number") {
		number = toNumber(number, {
			decimalMark
		});
	}
	if (isNaN(number)) {
		return "NaN";
	}
	if (number === Infinity) {
		return "Infinity";
	}
	if (number === -Infinity) {
		return (useParens ? "(Infinity)" : "-Infinity");
	}

	if (maxPrecision < 2 && typeof arguments[1].minPrecision === "undefined") {
		minPrecision = maxPrecision;
	}
	if (minPrecision > 2 && typeof arguments[1].maxPrecision === "undefined") {
		maxPrecision = minPrecision;
	}


	const negative = number < 0;
	let n = Math.abs(number);

	n = toClean(n, {
		decimalMark,
		thousandSeperator,
		maxPrecision,
		minPrecision
	});

	n = (symbolBehind ? n + " " + symbol : symbol + n);
	if (negative) {
		n = (useParens ? "(" + n + ")" : "-" + n);
	}
	return n;
}

function toClosest(number, roundTo = 1) {
	if (typeof number !== "number") {
		number = toNumber(number);
	}
	if (isNaN(number)) {
		return NaN;
	}
	if (number === Infinity || number === -Infinity) {
		return number;
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
	let n = Math.round(number / roundTo) * roundTo;

	let maxPrecision = 0;
	while (!Number.isInteger(roundTo)) {
		roundTo *= 10;
		maxPrecision++;
	}
	n = +n.toFixed(maxPrecision);
	return n;
}

// allows for `import {toNumber, ...} from ...`
export { toNumber };
export { toClean };
export { toMoney };
export { toClosest };

// allows for `import mod from ...`
export default {
	toNumber,
	toClean,
	toMoney,
	toClosest
};
