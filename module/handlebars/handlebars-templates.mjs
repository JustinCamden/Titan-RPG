/**
 * Define a set of template paths to pre-load
 */
export const preloadHandlebarsTemplates = async function () {
  // Equals helper
  Handlebars.registerHelper("equals", (a, b) => {
    return a == b;
  });

  // Die class helper
  Handlebars.registerHelper("dieClasses", (die) => {
    let retVal = "die";

    // Success and failure classes
    if (die.success) {
      if (die.criticalSuccess) {
        retVal = retVal + " critical-success";
      } else {
        retVal = retVal + " success";
      }
    } else {
      if (die.criticalFailure) {
        retVal = retVal + " critical-failure";
      } else {
        retVal = retVal + " failure";
      }
    }

    // Expertise class
    if (die.expertiseApplied) {
      retVal = retVal + " expertise-applied";
    }

    return retVal;
  });
};
