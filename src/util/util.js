/**
 * Capitalizes the first letter of each word in a text string.
 * @param {string} text - The input text to be processed
 * @returns {string} The text with the first letter of each word capitalized
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};
