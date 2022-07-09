export class TitanChatMessage extends ChatMessage {
  async getHTML() {
    // Get the HTML
    const $html = await super.getHTML();

    // Get the visibility elements
    const visibilityElements = Array.from(
      $html[0].querySelectorAll("[data-visibility]")
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

    return $html;
  }
}
