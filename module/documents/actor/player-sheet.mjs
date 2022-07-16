import { TitanActorSheet } from "./actor-sheet.mjs";

export class TitanPlayerSheet extends TitanActorSheet {
  get template() {
    return `systems/titan/templates/actor/${this.actor.type}-sheet.hbs`;
  }
}
