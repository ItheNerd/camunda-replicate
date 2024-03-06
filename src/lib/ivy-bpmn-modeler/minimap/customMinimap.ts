import Minimap from "diagram-js-minimap";

class CustomMinimap extends Minimap {
  constructor(
    config: any,
    injector: any,
    eventBus: any,
    canvas: any,
    elementRegistry: any
  ) {
    super(config, injector, eventBus, canvas, elementRegistry);
  }

  toggle(open?: boolean) {
    if (open) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    super.open();

    // Custom code to change button behavior or appearance
    // For example, change button title or style
    this._toggle.innerText = "Close Minimap";
  }

  close() {
    super.close();

    // Custom code to change button behavior or appearance
    // For example, change button title or style
    this._toggle.innerText = "Open Minimap";
  }
}

export default CustomMinimap;
