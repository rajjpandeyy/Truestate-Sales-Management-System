/**
 * Formats a number as INR currency.
 * @param {number|string} value 
 * @returns {string} e.g. "₹21,340"
 */
export const formatCurrency = (value) => {
    if (value === undefined || value === null) return '';
    const number = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
    if (isNaN(number)) return value; // Return original if parse failed

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(number);
};

/**
 * Capitalizes the first letter of each word.
 * @param {string} str 
 * @returns {string}
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
};
