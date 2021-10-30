/**
 * Convert value to number
 * @param  {string|number} value Value
 * @param  {object} [options={}] Options
 * @param  {string} [options.decimalMark="."] Decimal mark character
 * @return {number} Number
 */
export function toNumber(value: string | number, { decimalMark, }?: {
    decimalMark?: string;
}): number;
/**
 * Like `toFixed` but removes trailing zeros
 * @param  {string|number} value Value
 * @param  {object} [options={}] Options
 * @param  {string} [options.decimalMark="."] Decimal mark character
 * @param  {string} [options.thousandSeparator=","] Thousands separator character
 * @param  {number} [options.maxPrecision=10] Maximum number of decimal places
 * @param  {number} [options.minPrecision=0] Minimum number of decimal places
 * @return {string} Cleaned value
 */
export function toClean(value: string | number, { decimalMark, thousandSeperator, thousandSeparator, maxPrecision, minPrecision, }?: {
    decimalMark?: string;
    thousandSeparator?: string;
    maxPrecision?: number;
    minPrecision?: number;
}): string;
/**
 * Convert string or number to currency string
 * modified from http://stackoverflow.com/a/149099/806777\
 * @param  {string|number} value Value
 * @param  {object} [options={}] Options
 * @param  {string} [options.decimalMark="."] Decimal mark character
 * @param  {string} [options.thousandSeparator=","] Thousands separator character
 * @param  {number} [options.maxPrecision=10] Maximum number of decimal places
 * @param  {number} [options.minPrecision=0] Minimum number of decimal places
 * @param  {string} [options.symbol="$"] Currency symbol character
 * @param  {bool} [options.symbolBehind=false] Place currency symbol behind number
 * @param  {bool} [options.useParens=true] Use parentheses for negative values
 * @return {string} Value to currency string
 */
export function toMoney(value: string | number, { decimalMark, thousandSeperator, thousandSeparator, maxPrecision, minPrecision, symbol, symbolBehind, useParens, }?: {
    decimalMark?: string;
    thousandSeparator?: string;
    maxPrecision?: number;
    minPrecision?: number;
    symbol?: string;
    symbolBehind?: any;
    useParens?: any;
}): string;
/**
 * Round number to closest multiple of number
 * @param  {string|number} value Value
 * @param  {number} [roundTo=1] Round to multiple of this number
 * @return {number} Rounded number
 */
export function toClosest(value: string | number, roundTo?: number): number;
declare namespace _default {
    export { toNumber };
    export { toClean };
    export { toMoney };
    export { toClosest };
}
export default _default;
