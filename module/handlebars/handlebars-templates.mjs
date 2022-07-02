/**
 * Define a set of template paths to pre-load
 */
export const preloadHandlebarsTemplates = async function () {
  // Equals helper
  Handlebars.registerHelper("equals", (a, b) => {
    return a == b;
  });

  return;
};
