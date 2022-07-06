import TitanCheck from "./check.mjs";

export default class TitanAttackCheck extends TitanCheck {
  constructor(inData) {
    super(inData);
    this.targets = Array.from(game.user.targets);
  }

  _getChatTemplate() {
    return "systems/titan/templates/checks/check-attack.hbs";
  }
}
