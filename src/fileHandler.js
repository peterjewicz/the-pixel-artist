export default class {

  constructor(stage) {
    this.stage = stage;
    this.nameField;
    this.localKeys;
    this.saveWrapper;
    this.init();
  }


  /**
  * Initializes the file handler and binds events
  * @return {void}
  */
  init() {

    localforage.keys().then((keys) => {
      this.localKeys = keys
    })
    // this.localKeys = Object.keys(localStorage);

    const saveOpener = document.getElementById("saveOpener");
    saveOpener.addEventListener("click", () =>  {
      this.handleShowSaveBox();
    });

    const saveClose = document.getElementById("close-save-wrapper");
    saveClose.addEventListener("click", () =>  {
      this.handleShowSaveBox();
    });

    const saveHandler = document.getElementById("save");
    saveHandler.addEventListener("click", () => {
      this.handleSave();
    });


    this.saveWrapper = document.getElementById("save-popup-wrapper");
    this.nameField = document.getElementById("filename");
    this.handleInitialLoad();
  }

  /**
  * Handles the initial load from the home screen by examining the query string
  * If a load value is set it will attempt to load it to the page
  * @return {void}
  */
  handleInitialLoad() {
    const localStorageKey = this.getParameterByName('load');
    //index of returns -1 on a not found
      if(localStorageKey != null) {
        localforage.getItem(localStorageKey).then((value) => {
          this.handleLoad(value);
          let loadWrapper = document.getElementById("loading-wrapper");
          loadWrapper.classList.toggle('removed')
        }).catch(function (err) {
          console.log('Error Loading JSON');
          console.log(err)
        });
      } else {
        let loadWrapper = document.getElementById("loading-wrapper");
        loadWrapper.classList.toggle('removed')
      }


    // if(this.localKeys.indexOf(localStorageKey != -1) && localStorageKey != null) {
    //   // this.handleLoad(localStorage.getItem(localStorageKey));
    // }

  }

  /**
  * Handles the hide and show of the save box
  * @return {void}
  */
  handleShowSaveBox() {
    this.saveWrapper.classList.toggle('active')
  }

  /**
  * Returns the value for the key passed in for the current urls query string
  * @param {string} name
  * @return {string}
  */
  getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  /**
  * Converts the RGB code to human readable format
  * @param {string} r - red value
  * @param {string} g - green value
  * @param {string} b - blue value
  * @return {string} - hex string representing a color i.e #fffff
  */
  rgbToHex(r, g, b) {
      if (r > 255 || g > 255 || b > 255)
          throw "Invalid color component";
      return ((r << 16) | (g << 8) | b).toString(16);
  }

  /**
  * Saves the current stage state as json encoded array to the file system
  * @return {void} - But side effect of a new file
  */
  handleSave() {

    const name = this.nameField.value;

    if(name.trim() == ''){
      alert("Name cannot be blank");
      return;
    }


    let savedContent = [];
    let columnCount = 0;
    for(let y = 5; y < this.stage.canvas.height; y = y + 20){
      savedContent[columnCount] = [];
      for(let x = 5; x < this.stage.canvas.width; x = x + 20){
        let p = this.stage.ctx.getImageData(x, y, 1, 1).data;
        let hex;

        //This handles the pure black code which will return #0 and fail in this setup
        if(p[0] == 0 && p[1] == 0 && p[2] == 0 && p[3] == 255){
          hex = "#000000";
        } else {
          hex = "#" + (this.rgbToHex(p[0], p[1], p[2])).slice(-6);
        }
        //if it's blank we change it to white to display later
        //TODO if we go to a checked BG this needs to change
        if(hex == "#0") {
          hex = "#ffffff"
        }
        savedContent[columnCount].push(hex);

      }
      columnCount++;
    }
    savedContent = JSON.stringify(savedContent);

    // localStorage.setItem(name, savedContent);
    window.localforage.setItem(name, savedContent)
    alert("Image Saved!");
    this.saveWrapper.classList.toggle('active')
  }


  /**
  * Loads a json encoded string, parses it, and then outputs it to the screen
  * @param {jsonstring} a json encoded string that contains the paiting data
  * NOTE: this must be JSON or the attempt to parse it will fail
  * @return {void}
  */
  handleLoad(loadContent) {
    loadContent = JSON.parse(loadContent);
    for(let y = 0; y < loadContent.length; y++) {
      for(let x = 0; x < loadContent[y].length; x++) {
        this.stage.ctx.fillStyle = loadContent[y][x];
        this.stage.ctx.fillRect(x * 20,y * 20,20,20);
        this.stage.bgctx.stroke();
      }
    }
  }

}
