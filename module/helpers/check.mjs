export default class Check {
  constructor(inData) {
    this.parameters = {
      numberOfDice: inData?.numberOfDice > -1 ? inData.numberOfDice : 1,
      expertise: inData?.expertise > 0 ? inData.expertise : 0,
      difficulty:
        inData?.difficulty > 1 && inData?.difficulty < 7
          ? inData.difficulty
          : 4,
      complexity: inData?.complexity > -1 ? inData.complexity : 0,
    };

    this.evaluated = false;
    this.results = {};
    this.roll = null;
    this.chatMessage = null;
  }

  async evaluateCheck() {
    this.roll = new Roll(
      `${this.parameters.numberOfDice}d6cs>=${this.parameters.difficulty}`
    );
    await this.roll.evaluate({ async: true });
    const results = this._calculateResult();
    this.evaluated = true;
    return results;
  }

  _calculateResult() {
    let results = {
      successes: 0,
      expertiseRemaining: this.parameters.expertise,
      dice: [],
    };

    // Sort the dice from the check from largest to smallist
    let sortedDice = this._getSortedDiceFromRoll();

    for (let i = 0; i < sortedDice.length; i++) {
      // Log the current dice and expertise applied
      results.dice[i] = {};
      results.dice[i].base = sortedDice[i];
      results.dice[i].final = sortedDice[i];

      // Log the success if appropriate
      if (results.dice[i].base >= this.parameters.difficulty) {
        results.successes = results.successes + 1;
        results.dice[i].success = true;
        if (results.dice[i].base == 6) {
          results.dice[i].criticalSuccess = true;
        }
      }
      // Otherwise, try and and apply expertise
      else {
        // While expertise is remaining
        while (
          results.expertiseRemaining > 0 &&
          results.dice[i].final < this.parameters.difficulty
        ) {
          // Increase the roll by 1
          results.dice[i].final = results.dice[i].final + 1;

          // Decrease the expertise remainging
          results.expertiseRemaining = results.expertiseRemaining - 1;

          // Log the expertise use
          results.dice[i].expertiseApplied = results.dice[i].expertiseApplied
            ? results.dice[i].expertiseApplied + 1
            : 1;
        }
        // If this is now a success, log the success.
        if (results.dice[i].final >= this.parameters.difficulty) {
          results.successes = results.successes + 1;
          results.dice[i].success = true;
        }

        // Log the critical if appropriate
        if (results.dice[i].final == 6) {
          results.dice[i].criticalSuccess = true;
        } else if (results.dice[i].final == 1) {
          results.dice[i].criticalFailure = true;
        }
      }
    }

    // Log whether the check was a success or a failure
    if (this.parameters.complexity > 0) {
      if (results.successes >= this.parameters.complexity) {
        results.succeeded = true;
        if (results.successes > this.parameters.complexity) {
          results.extraSuccesses =
            results.successes - this.parameters.complexity;
        }
      } else {
        results.failed = true;
      }
    }

    this.results = results;
    return results;
  }

  _getSortedDiceFromRoll() {
    let retVal = [];
    const results = this.roll.terms[0].results;
    if (results) {
      for (let i = 0; i < results.length; i++) {
        retVal.push(results[i].result);
      }
      retVal.sort((a, b) => b - a);
    }

    return retVal;
  }

  async toChatMessage(inData) {
    if (!this.evaluated) {
      return;
    }

    // Setup the data to display
    let checkData = {
      label: inData.label ? inData.label : "",
      parameters: this.parameters,
      results: this.results,
    };

    // Create the html
    let chatContent = await renderTemplate(this._getChatTemplate(), checkData);

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
