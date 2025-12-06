/**
 * Cleans a price string and returns a float.
 * Removes all non-numeric characters except '.' and '-'
 * @param {string} dateString 
 * @returns {number}
 */
const cleanPrice = (priceString) => {
    if (!priceString) return 0;
    return parseFloat(priceString.toString().replace(/[^0-9.-]+/g, ""));
};

/**
 * Parses tags string into array
 * @param {string} tagsString 
 * @returns {string[]}
 */
const parseTags = (tagsString) => {
    if (!tagsString) return [];
    return tagsString.split(',').map(t => t.trim());
};

module.exports = { cleanPrice, parseTags };
