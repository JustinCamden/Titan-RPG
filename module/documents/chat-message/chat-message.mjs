export class TitanChatMessage extends ChatMessage {
  async getHTML() {
    // Get the HTML
    const html = await super.getHTML();

    // Get the visibility elements
    const visibilityElements = Array.from(
      html[0].querySelectorAll("[data-visibility]")
    );

    // Calculate whether this user is the GM
    const isGm = game.user.isGM;

    // Calculate weather this user is the owner
    if (!isGm) {
      // Filter GM only information{
      for (const element of visibilityElements.filter(
        (e) => e.dataset.visibility === "gm"
      )) {
        element.remove();
      }

      // Calculate whether this user has ownership over the speaker
      const speaker =
        this.constructor.getSpeakerActor(this.speaker) || this.user?.character;
      const isOwner = speaker?.isOwner ? true : false;

      // Filter Owner only information
      if (!isOwner) {
        for (const element of visibilityElements.filter(
          (e) => e.dataset.visibility === "owner"
        )) {
          element.remove();
        }
      }

      // Filter author only information
      if (!this.isAuthor) {
        for (const element of visibilityElements.filter(
          (e) => e.dataset.visibility === "author"
        )) {
          element.remove();
        }
      }
    }

    this.activateListeners(html);

    return html;
  }

  async _onCreate(data, options, userId) {
    const chatMessage = await super._onCreate(data, options, userId);
    CONFIG.chat;
    return chatMessage;
  }

  activateListeners(html) {
    html.find(".apply-damage").click(this._onApplyDamage.bind(this));

    return;
  }

  async _onApplyDamage(event) {
    // Get the damage amount
    const damage = parseInt(event.target.dataset.damage);

    // Get the user targets
    const userTargets = Array.from(game.user.targets);

    // For each target
    for (let idx = 0; idx < userTargets.length; idx++) {
      // If the target is valid
      const target = userTargets[idx]?.actor;
      if (target) {
        // Apply damage to the target
        await target.applyDamage(damage);
      }
    }

    return;
  }
}
