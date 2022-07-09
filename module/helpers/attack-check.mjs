import TitanCheck from "./check.mjs";

export default class TitanAttackCheck extends TitanCheck {
  constructor(inData) {
    super(inData);
    this.baseDamage = inData.baseDamage;
    this.plusSuccessDamage = inData.plusSuccessDamage;
  }

  // Calculates the result of the check
  _calculateResult() {
    let results = super._calculateResult();

    // If the check succeeded
    if (results.succeeded) {
      // Calculate damage
      results.damage = this.baseDamage;
      if (this.plusSuccessDamage && results.extraSuccesses) {
        results.damage = results.damage + results.extraSuccesses;
      }
    }

    this.results = results;
    return results;
  }

  _getChatTemplate() {
    return "systems/titan/templates/checks/check-attack.hbs";
  }

  async toChatMessage(inData) {
    if (!this.evaluated) {
      return;
    }

    // Setup the data to display
    let checkData = {
      label: inData.label ? inData.label : inData.label,
      attackName: inData.attackName ? inData.attackName : false,
      weaponName: inData.weaponName ? inData.weaponName : false,
      parameters: this.parameters,
      results: this.results,
      canRollDamage: this.roller === game.user || game.user.isGM,
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
}
