/**
* Main Stage Class
* Handles setting up and interaction with the Canvas elemet
*/
export default class {

    constructor() {
      this.fillColor = "black";
      this.erase = false;

      //The reference to the canvas element and context of it
      //required for all drawing functionality so we'll define it here once
      this.canvas;
      this.ctx;

      this.backgroundCanvas;
      this.bgctx;

      this.colorPicker = null; // Holds a reference to the colorpicker so we can call methods on it
    }

    /**
    * Initializes the stage by creating it and binding events
    * @return {void}
    */
    init() {
      const wrapper = document.getElementById("canvas-wrapper");

      //setup the background Canvas
      this.backgroundCanvas = document.getElementById("background-canvas");
      this.backgroundCanvas.style.width = wrapper.clientWidth;
      this.backgroundCanvas.style.height = wrapper.clientHeight;
      this.backgroundCanvas.width = wrapper.clientWidth;
      this.backgroundCanvas.height = wrapper.clientHeight;


      this.canvas = document.getElementById("canvas");
      this.canvas.style.width = wrapper.clientWidth;
      this.canvas.style.height = wrapper.clientHeight;
      this.canvas.width = wrapper.clientWidth;
      this.canvas.height = wrapper.clientHeight;



      this.ctx = canvas.getContext("2d");
      this.bgctx = this.backgroundCanvas.getContext("2d");

      let promise = new Promise((resolve, reject) => {
        for(var x = 0; x < this.canvas.width; x = x + 20) {
          for(var y = 0; y < this.canvas.height; y = y + 20) {
            this.bgctx.rect(x,y,20,20);
            this.bgctx.stroke();

            // we need this so a downloaded image isn't all black
            // we also override the fill style used above so we can paint right away
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(x,y,20,20);
          }
        }
        this.bindEvents();
        return resolve();
      });

      // Removes the loading screen on successful canvas render
      promise.then(result => {
        // let loadWrapper = document.getElementById("loading-wrapper");
        // loadWrapper.classList.toggle('removed')
      })
    }


    /**
    * Binds event handlers to the canvas - Should pass reference of current 'this' to function
    * @return {void}
    */
    bindEvents() {

      this.canvas.addEventListener("click", () => {
        this.handleClick();
      });

      // Draw Events
      // THESE Work for web based version
      this.backgroundCanvas.addEventListener("mousedown", this.handleMouseDown);
      this.backgroundCanvas.addEventListener("mouseup", this.handleMouseUp);
      this.backgroundCanvas.addEventListener("mousemove", () => {
        this.handleDrag();
      });

      // Mobile devices have tocuh events
      this.backgroundCanvas.addEventListener("touchstart", this.handleMouseDown);
      this.backgroundCanvas.addEventListener("touchend", this.handleMouseUp);
      this.backgroundCanvas.addEventListener("touchmove", () => {
        this.handleDrag();
      });


      //TOOL HANDLERS THAT ARE STAGE SPECIFIC GO HERE
      let eraseHandler = document.getElementById("erase");
      eraseHandler.addEventListener("click", () => {
        this.toggleErase();
      });
      let pencilTool = document.getElementById("pencilTool");
      pencilTool.addEventListener("click", () => {
        this.activatePencil();
      });

      handleDownload.addEventListener("click", () => {
        this.downloadImage();
      });

    }



    /**
    * Handles creating and downloading an image to the users computer or device
    * @return {void}
    */
    downloadImage() {
      // This display the image on screen. Kept here in case we need it later
      // window.location = this.canvas.toDataURL("image/png");

      // Attempts to call the cordova specific code to save the image to device, and if that fails
      // downloads it like normal. Works for both mobile devices as well as browser
      try {
        // This uses canvas2image cordova plugin to save the Image
        //Callbacks for image saving
        let success = function(msg){
            alert(msg);
        };

        let error = function(err){
            alert(err);
        };

        let imageDataUrl = this.canvas.toDataURL('image/jpeg', 1.0);
        let imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
        cordova.exec(
          success,
          error,
          'Canvas2ImagePlugin',
          'saveImageDataToLibrary',
          [imageData]
        );
      } catch (error) {
        // Webcode here
        //this converts it to a data uri
        // TODO this saves the image as unknown without and extension which is annoying
        // We need to find a way to change the name of it so it opens easier
        let image = this.canvas.toDataURL('image/jpeg');
        let prev = window.location.href;
        window.location.href = image.replace("image/jpeg", "image/octet-stream");
      }
    };


    /**
    * Handles a single click on the Canvas
    * Note: this also fires at the end of the drag event
    * @return {void}
    */
    handleClick() {
      var rect = this.canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;

      x = x - (x % 20);
      y = y - (y % 20);

      if(this.erase === false) {
        this.ctx.fillRect(x,y,20,20);
      }
    }


    /**
    * Toggles the mouse down state on the current stage class
    * TODO define mousedown on the stage object
    * @return {void}
    */
    handleMouseDown() {
      event.preventDefault();
      window.mouseDown = true;
    }

    /**
    * Toggles the mouseup state on the current stage class
    * TODO define mouseup on the stage object
    * @return {void}
    */
    handleMouseUp() {
      event.preventDefault();
      window.mouseDown = false;
    }


    /**
    * Handles dragging and coloring across the Canvas
    * @return {void}
    */
    handleDrag() {
      event.preventDefault();
      if(window.mouseDown) {
        var rect = this.canvas.getBoundingClientRect();
        let x, y;

        // We need to get the position differently on mobile and web devices
        if (event.type === "mousemove") {
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
        } else {
           x = event.pageX - rect.left;
           y = event.pageY - rect.top;
        }

        x = x - (x % 20);
        y = y - (y % 20);


        if(this.erase === false) {
          this.ctx.fillStyle = this.fillColor;
          this.ctx.fillRect(x,y,20,20);
        } else{
          // Little hack so downloaded image isn't all black after erase
          this.ctx.fillStyle = "white";
          this.ctx.fillRect(x, y, 20, 20);
          this.ctx.fillStyle = this.fillColor;
        }
      }
    }


    /**
    * Toggles the erase state ON
    * @return {void}
    */
    toggleErase() {
      this.erase = true;
      this.colorPicker.setInactive();
    }

    /**
    * Toggles on the pencil which toggles off erase && colorpicker
    * @return {void}
    */
    activatePencil() {
      this.erase = false;
      this.colorPicker.setInactive();
    }

    /**
    * Takes a color and sets the fill color as it
    * @param {string} color
    * @return {void}
    */
    setColor(color) {
      this.fillColor = color;
      this.erase = false;
    }

    /**
    * Sets a reference to the color picker
    * @param {object} colorPicker
    * @returns {void}
    */
    setColorPickerRef(colorPicker) {
      this.colorPicker = colorPicker;
    }


}
