/**
 * Normalise une chaîne de caractères en remplaçant les caractères accentués
 * @param {string} str - La chaîne à normaliser
 * @returns {string} La chaîne normalisée
 */
export const normalizeString = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

/**
 * Compare deux chaînes en ignorant les accents et la casse
 * @param {string} str1 - Première chaîne
 * @param {string} str2 - Deuxième chaîne
 * @returns {boolean} True si les chaînes correspondent en ignorant les accents et la casse
 */
export const compareStringsNoAccent = (str1, str2) => {
  return normalizeString(str1).includes(normalizeString(str2));
};
