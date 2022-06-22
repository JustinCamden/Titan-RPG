export default class Check {
  constructor(inData) {
    this.parameters = {
      numberOfDice: inData.numberOfDice ? inData.numberOfDice : 1,
      expertise: inData.expertise ? inData.expertise : 0,
      difficulty: inData.difficulty ? inData.difficulty : 4,
      complexity: inData.complexity ? inData.complexity : 1,
    };
    this.evaluated = false;
    this.result = {};
    this.roll = null;
    this.chatMessage = null;
  }

  async evaluateCheck() {
    this.roll = new Roll(
      `${this.parameters.numberOfDice}d6cs>=${this.parameters.difficulty}`
    );
    await this.roll.evaluate({ async: true });
    const result = this._calculateResult();
    this.evaluated = true;
    return result;
  }

  _calculateResult() {
    let result = {
      succeses: 0,
      expertiseRemaining: this.parameters.expertise,
      expertiseAppliedByDie: [],
      successesByDie: [],
      finalDice: [],
      baseDice: null,
    };

    // Sort the dice from the check from largest to smallist
    result.baseDice = this._getSortedDiceFromRoll();
    for (let i = 0; i < result.baseDice.length; i++) {
      // Log the current dice and expertise applied
      result.finalDice.push(result.baseDice[i]);
      result.expertiseAppliedByDie[i] = 0;
      result.successesByDie[i] = 0;

      // Log the success if appropriate
      if (result.finalDice[i] >= this.parameters.difficulty) {
        result.succeses = result.succeses + 1;
        result.successesByDie[i] = 1;
      }
      // Otherwise, try and and apply expertise
      else {
        // While expertise is remaining
        while (
          result.expertiseRemaining > 0 &&
          result.finalDice[i] < this.parameters.difficulty
        ) {
          // Increase the roll by 1
          result.finalDice[i] = result.finalDice[i] + 1;

          // Decrease the expertise remainging
          result.expertiseRemaining = result.expertiseRemaining - 1;

          // Log the expertise use
          result.expertiseAppliedByDie[i] = result.expertiseAppliedByDie[i] + 1;

          // If this is now a success, log the success.
          if (result.finalDice[i] >= this.parameters.difficulty) {
            result.succeses = result.succeses + 1;
            result.successesByDie[i] = 1;
          }
        }
      }
    }

    this.result = result;
    return result;
  }

  _getSortedDiceFromRoll() {
    let retVal = [];
    const results = this.roll.terms[0].results;
    for (let i = 0; i < results.length; i++) {
      retVal.push(results[i].result);
    }
    retVal.sort((a, b) => b - a);

    return retVal;
  }

  async toChatMessage(inData) {
    if (!this.evaluated || !inData) {
      return;
    }

    let checkData = {
      label: inData.label,
      parameters: this.parameters,
      results: this.result,
    };

    let chatContent = await renderTemplate(this._getChatTemplate(), checkData);

    let chatData = {
      user: inData.user,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      speaker: inData.speaker,
      roll: this.roll,
      rollMode: game.settings.get("core", "rollMode"),
      content: chatContent,
    };

    /**        chatData.speaker.alias = this.actor.token ? this.actor.token.name : this.actor.data.token.name
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperRecipients("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        } */

    this.chatMessage = ChatMessage.create(chatData);

    return this.chatMessage;
  }

  _getChatTemplate() {
    return "systems/titan/templates/checks/check-basic.hbs";
  }
}
