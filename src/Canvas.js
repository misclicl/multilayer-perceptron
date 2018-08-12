export default class Canvas {
  constructor(width, heigth, element = 'document') {
    this.canvasObject = document.createElement('canvas');
    this.canvasObject.width = width;
    this.canvasObject.height = heigth;
    document.querySelector(element).appendChild(this.canvasObject);
  }
}
