// src/utils/base64.js

/**
 * Safe version of atob to avoid errors when decoding invalid Base64 strings.
 * @param {string} str - The Base64 encoded string.
 * @returns {string} - The decoded string or empty string on error.
 */
export const safeAtob = (str) => {
  try {
    if (!str) return '';
    return atob(str);
  } catch (e) {
    console.error('❌ Failed to decode Base64:', e);
    return '';
  }
};

/**
 * Safe version of btoa to avoid errors when encoding invalid strings.
 * @param {string} str - The string to encode.
 * @returns {string} - The Base64 encoded string or empty string on error.
 */
export const safeBtoa = (str) => {
  try {
    if (!str) return '';
    return btoa(str);
  } catch (e) {
    console.error('❌ Failed to encode Base64:', e);
    return '';
  }
};
