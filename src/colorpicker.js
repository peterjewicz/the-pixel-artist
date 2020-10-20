export default class {

  /**
  * Colorpicker functionality wrapper
  * @param {Colorpicker} object that has plugin functionality
  * @param {Stage} stage - reference to current stage
  * @return {void}
  */
  constructor(colorpicker, stage) {
    this.isActive = false;
    this.colorpicker = colorpicker;
    this.stage = stage;
    this.elem;
    this.init();
  }

  /**
  * Initializes the colorpicker by creating it and binding events
  * @return {void}
  */
  init() {
    this.elem = document.getElementById("colorpicker");
    const pickerElem = document.getElementById("displayPicker");
    pickerElem.addEventListener("click", () => {
      this.toggleActive();
    });

    this.colorpicker.onchange = (picker) => {
      this.stage.setColor(picker.color);
    };
  }

  /**
  * Turns the colorpicker off
  * @return void
  */
  setInactive() {

    if(this.isActive) {
      this.elem.classList.toggle('active');
      this.isActive = false;
    }
  }

  /**
  * Toggle the display of the color picker
  * @return {void}
  */
  toggleActive() {
    this.elem.classList.toggle('active');
    if(this.isActive) {
      this.isActive = false;
    } else {
      this.isActive = true;
    }
  }

}
