
export default class ImageUtil {

  static applyRedMask(initialImage) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = initialImage.width;
    canvas.height = initialImage.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(initialImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;   // Red
      data[i + 1] = 0; // Green
      data[i + 2] = 0; // Blue
    }
    ctx.putImageData(imageData, 0, 0);
    const newImage = new Image();
    newImage.src = canvas.toDataURL();
    return newImage;
  }

}