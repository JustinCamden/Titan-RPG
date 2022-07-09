export class TitanChatMessage extends ChatMessage {
  test = true;
  async getHTML() {
    // Get the HTML
    const $html = await super.getHTML();

    // Get the visibility elements
    const visibilityElements = Array.from(
      $html[0].querySelectorAll("[data-visibility]")
    );

    // Calculate whether this user is the GM
    let isGm = game.user.isGM;

    // Calculate weather this user is the owner
    let isOwner = isGm || this.roller === game.user;

    // Filter GM only information
    if (!isGm) {
      for (const element of visibilityElements.filter(
        (e) => e.dataset.visibility === "gm"
      )) {
        element.remove();
      }
    }

    // Filter Owner only information
    if (!isOwner) {
      for (const element of visibilityElements.filter(
        (e) => e.dataset.visibility === "owner"
      )) {
        element.remove();
      }
    }

    return $html;
  }
}
