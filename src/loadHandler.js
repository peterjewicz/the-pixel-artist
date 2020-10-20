export default class {

  constructor() {

      this.button;
      this.elem;
      this.localKeys;
      this.loadItemsInsert;
      this.init();
  }


  /**
  * Initializes by creating it and binding events
  * @return {void}
  */
  init() {
    this.elem = document.getElementById("loader");
    this.loadItemsInsert = document.getElementById("loaded-items-insert");

    this.button = document.getElementById("load-button");
    this.button.addEventListener('click',(event) => {
      this.handleLoaderToggle()
    });

    const closeLoader = document.getElementById("close-load-wrapper");
    closeLoader.addEventListener('click',(event) => {
      this.handleLoaderToggle()
    });

    this.setLocalKeys();
  }

  /**
  * Gets the keys of the localstorage objects and binds them to the object
  * @return {void}
  */
  setLocalKeys() {
    // this.localKeys = Object.keys(localStorage);
    // console.log(localforage.keys());
    this.localKeys = window.localforage.keys().then((keys) => {
      this.generateLoadHtml(keys)
    }).catch(function (err) {
      console.log('Error Getting Keys')
    });
  }


  /**
  * Generates HTML to allow the loading of saved images
  * @param {array} keys
  * @return {void}
  */
  generateLoadHtml(keys) {
    let outputHtml = "";
    for(var x = 0; x < keys.length; x++) {
      outputHtml += "<div><h2><a href='editor.html?load="+keys[x]+"'>"+keys[x]+"</a></h2></div>";
    }

    this.loadItemsInsert.innerHTML = outputHtml;
  }


  /**
  * Handles display of the load overlay
  * @return {void}
  */
  handleLoaderToggle() {
    console.log("Load Button Clicked")
    this.elem.classList.toggle('active')
  }


}
