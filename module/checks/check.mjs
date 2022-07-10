import TitanUtility from "../helpers/utility.mjs";

export default class TitanCheck {
  // Constructor
  constructor(inData) {
    // Check if the ID is valid
    if (!inData?.actorId) {
      console.error(
        "TITAN | Check failed during construction. No provided Actor ID."
      );
      this.isValid = false;
      return this;
    }

    // Check if the actor is valid
    const checkActor = game.actors.get(inData.actorId);
    if (!checkActor) {
      console.error(
        "TITAN | Check failed during construction. Invalid Actor ID."
      );
      this.isValid = false;
      return this;
    }

    // Initialize state variables
    this.isValid = true;
    this.isPrepared = false;
    this.isEvaluated = false;

    // Initialize Parameters
    this.parameters = {
      actorId: inData.actorId,
      difficulty: inData.difficulty
        ? TitanUtility.clamp(inData.difficulty, 2, 6)
        : 4,
      complexity: inData.complexity ? Math.max(0, inData.complexity) : 0,
      diceMod: inData.diceMod ?? 0,
      expertiseMod: inData.expertiseMod ?? 0,
      doubleExpertise: inData.doubleExpertise ?? false,
      maximizeSuccesses: inData.maximizeSuccesses ?? false,
      extraSuccessOnCritical: inData.extraSuccessOnCritical ?? false,
      extraFailureOnCritical: inData.extraFailureOnCritical ?? false,
    };

    return this;
  }

  // Prepare the check with data from the actor
  prepareCheck() {
    const checkActor = game.actors.get(this.parameters.actorId);
    if (!checkActor) {
      console.error(
        "TITAN | Check failed during prepareCheck(). Invalid Actor ID."
      );
      this.isValid = false;
      return false;
    }

    // Get the check data from the actor
    const checkData = checkActor.getCheckData();
    this.actorData = this._calculateActorData(checkData);
    this.finalData = this._calculateFinalData(this.actorData);

    this.isPrepared = true;

    return true;
  }

  _calculateActorData(checkData) {
    // Use the check data to calculate the check data
    return {};
  }

  _calculateFinalData(actorData) {
    // Calculate the final total dice and expertise
    const finalData = {
      totalDice: this.parameters.diceMod,
      totalExpertise: this.parameters.doubleExpertise
        ? this.parameters.expertiseMod * 2
        : this.parameters.expertiseMod,
    };

    return finalData;
  }

  // Evaluates the check result
  async evaluateCheck(sendToChat) {
    // Ensure the check is prepared
    if (!this.isPrepared) {
      if (!this.prepareCheck()) {
        return false;
      }
    }

    // Get the roll for the check
    this.roll = new Roll(`${this.finalData.totalDice}d6`);
    await this.roll.evaluate({ async: true });

    // Calculate the results of the check
    this.results = this._calculateResults();
    this.isEvaluated = true;

    return this.results;
  }

  // Calculates the result of the check
  _calculateResults() {
    const results = {
      dice: [],
      criticalFailures: 0,
      criticalSuccesses: 0,
      successes: 0,
      expertiseRemaining: this.finalData.totalExpertise,
    };

    // Sort the dice from the check from largest to smallist
    let sortedDice = this._getSortedDiceFromRoll();
    const numDice = sortedDice.length;

    // Initialize the base and final result of the die
    const difficulty = this.parameters.difficulty;
    for (let i = 0; i < sortedDice.length; i++) {
      results.dice[i] = {
        base: sortedDice[i],
        final: sortedDice[i],
      };
    }

    // Apply expertise depending on parameters
    const extraSuccessOnCritical = this.parameters.extraSuccessOnCritical;
    const extraFailureOnCritical = this.parameters.extraFailureOnCritical;

    // Apply expertise to dice that will be critical failures
    if (extraFailureOnCritical) {
      for (let i = 0; i < numDice; i++) {
        if (results.dice[i].final == 1) {
          results.expertiseRemaining -= 1;
          results.dice[i].final = 2;
          results.dice[i].expertiseApplied = 1;

          // Abort early if we run out of expertise
          if (1 > results.expertiseRemaining) {
            break;
          }
        }
      }
    }

    // Apply expertise to dice that could become successes
    for (let increment = 1; increment < 6; increment++) {
      // Abort early if we run out of expertise
      if (increment > results.expertiseRemaining) {
        break;
      }

      // Apply expertise to dice that are == the increment from being a success
      for (let i = 0; i < numDice; i++) {
        if (
          results.dice[i].final < difficulty &&
          difficulty - results.dice[i].final == increment
        ) {
          results.expertiseRemaining -= increment;
          results.dice[i].final = difficulty;
          results.dice[i].expertiseApplied = results.dice[i].expertiseApplied
            ? results.dice[i].expertiseApplied + increment
            : increment;

          // Abort early if we run out of expertise
          if (increment > results.expertiseRemaining) {
            break;
          }
        }
      }

      // Apply expertise to dice that are == the increment from being a critical success
      if (extraSuccessOnCritical) {
        for (let i = 0; i < numDice; i++) {
          if (
            results.dice[i].final < 6 &&
            6 - results.dice[i].final == increment
          ) {
            results.expertiseRemaining -= increment;
            results.dice[i].final = 6;
            results.dice[i].expertiseApplied = results.dice[i].expertiseApplied
              ? results.dice[i].expertiseApplied + increment
              : increment;

            // Abort early if we run out of expertise
            if (increment > results.expertiseRemaining) {
              break;
            }
          }
        }
      }
    }

    // Calculate failures and successes
    for (let i = 0; i < numDice; i++) {
      // If this dice was a crit success
      if (results.dice[i].final == 6) {
        // Log the log the critical succcess
        results.criticalSuccesses += 1;
        results.successes += extraSuccessOnCritical ? 2 : 1;
        results.dice[i].success = true;
        results.dice[i].criticalSuccess = true;
      }

      // If this dice was a success
      else if (results.dice[i].final >= difficulty) {
        results.successes += 1;
        results.dice[i].success = true;
      }

      // If this dice was a critical failure
      else if (results.dice[i].final == 1) {
        results.dice[i].criticalFailure = true;
        if (extraFailureOnCritical) {
          results.successes -= 1;
        }
      }
    }

    // Calculate whether the check succeeded or not
    const complexity = this.parameters.complexity;
    if (complexity > 0) {
      // If succeeeded
      if (results.successes >= complexity) {
        results.succeeded = true;

        // If extra successes
        if (results.successes > complexity) {
          results.extraSuccesses = results.successes - complexity;
        }
      }
      // If failed
      else {
        results.succeeded = false;
      }
    }
    return results;
  }

  // Gets a sorted array of dice
  _getSortedDiceFromRoll() {
    let sortedDice = [];

    // Add each dice result to the return value
    const results = this.roll.terms[0].results;
    for (let i = 0; i < results.length; i++) {
      sortedDice.push(results[i].result);
    }

    // Sort the dice from largest to smallest
    sortedDice.sort((a, b) => b - a);

    return sortedDice;
  }

  async sendToChat(inData) {
    // Ensure the check is evaluated
    if (!this.evaluated) {
      await this.evaluateCheck();
    }

    // Setup the data to display
    const messageData = {
      label: inData.label ? inData.label : false,
      parameters: this.parameters,
      actorData: this.actorData,
      finalData: this.finalData,
      results: this.results,
    };

    // Create the html
    const chatContent = await renderTemplate(
      this._getChatTemplate(),
      messageData
    );

    // Create and post the message
    const messageClass = getDocumentClass("ChatMessage");
    this.chatMessage = messageClass.create(
      messageClass.applyRollMode(
        {
          user: inData.user ? inData.user : game.user.id,
          speaker: inData.speaker,
          roll: this.roll,
          content: chatContent,
          type: CONST.CHAT_MESSAGE_TYPES.ROLL,
          sound: CONFIG.sounds.dice,
        },
        inData.rollMode
          ? inData.rollMode
          : game.settings.get("core", "rollMode")
      )
    );

    return this.chatMessage;
  }

  _getChatTemplate() {
    return "systems/titan/templates/checks/check-basic.hbs";
  }
}
