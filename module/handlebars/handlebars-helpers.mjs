/**
 * Define a set of helpers to register
 */
export const registerHandlebarsHelpers = async function () {
  // Equals helper
  Handlebars.registerHelper("equals", (a, b) => {
    return a == b;
  });

  // Not helper
  Handlebars.registerHelper("not", (a) => {
    return !a;
  });

  // Greater helper
  Handlebars.registerHelper("greater", (a, b) => {
    return a > b;
  });

  // Greater equals helper
  Handlebars.registerHelper("greaterEquals", (a, b) => {
    return a >= b;
  });

  // Lesser helper
  Handlebars.registerHelper("lesser", (a, b) => {
    return a < b;
  });

  // Lesser equals helper
  Handlebars.registerHelper("lesserEquals", (a, b) => {
    return a <= b;
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
