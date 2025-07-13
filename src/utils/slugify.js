import slugify from 'slugify';

/**
 * Creates a URL-friendly slug from a string.
 * @param {string} text The text to convert into a slug.
 * @returns {string} The generated slug.
 */
const createSlug = (text = '') => {
  if (typeof text !== 'string' || text.trim() === '') {
    return 'no-title'; // Return a default slug for empty or invalid input
  }

  return slugify(text, {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: /[*+~.()/'"!:@]/g, // remove characters that match regex, defaults to `undefined`
    lower: true,       // convert to lower case, defaults to `false`
    strict: true,      // strip special characters except replacement, defaults to `false`
    locale: 'th',      // language code of the locale to use
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
  });
};

export default createSlug;
