/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class TitanItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["titan", "sheet", "item"],
      width: 780,
      height: 620,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
      scrollY: [".scrolling"],
    });
  }

  /**
   * Temporary data that will be reset on page load
   */
  // Expended state
  isExpanded = {};

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = this.item.toObject(false);

    // Add the items's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add item rarity options
    context.rarityOptions = {};
    for (let [k, v] of Object.entries(CONFIG.TITAN.item.rarity.option)) {
      context.rarityOptions[k] = v.label;
    }
    context.isExpanded = this.isExpanded;

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) {
      return;
    }

    // Expandable toggles
    html.find(".expand").click(this._onExpandElement.bind(this));

    return;
  }

  async _onExpandElement(event) {
    event.preventDefault();
    // Get the parent element
    let parent = $(event.currentTarget).parents(".expandable-parent");

    // Get the content element
    let content = parent.find(".expandable-content");

    // If the content is collapsed
    if (content.hasClass("collapsed")) {
      // Remove the collapsed class
      content.removeClass("collapsed");

      // Update the collapsed state
      const id =
        event.currentTarget.closest(".expandable-parent").dataset.expandableId;
      this.isExpanded[id.toString()] = true;
    } else {
      // Add the collapsed class
      content.addClass("collapsed");

      // Update the collapsed state
      const id =
        event.currentTarget.closest(".expandable-parent").dataset.expandableId;
      this.isExpanded[id.toString()] = false;
    }
  }
}
