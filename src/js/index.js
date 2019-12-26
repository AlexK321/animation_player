import '../css/style.css';
import { setTimeout } from 'core-js';
// import '../css/style.scss';

let instrument;
let color;
let unit;
let linkToImage;
const currentColor = document.getElementById('current');
const previousColor = document.getElementById('previous');
const button3232 = document.getElementById('button3232');
const button128128 = document.getElementById('button128128');
const button512512 = document.getElementById('button512512');
const button44 = document.getElementById('button44');
const li44 = document.getElementById('li44');
const li3232 = document.getElementById('li3232');
const li128128 = document.getElementById('li128128');
const li512512 = document.getElementById('li512512');
const full = document.getElementById('full');
const getImages = document.getElementById('getImages');
const mainContainer = document.getElementById('main_container');
const monochromeImage = document.getElementById('monochromeImage');
const clearImages = document.getElementById('clearImages');
let searchTown;

function paintingCanvas(idCan) {
  const canvas = document.getElementById(idCan);
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < (512 / unit); i++) {
    for (let j = 0; j < (512 / unit); j++) {
      if ((i + j) % 2 === 0) { ctx.fillStyle = '#528ad3'; } else { ctx.fillStyle = '#742f70'; }
      ctx.fillRect(j, i, 1, 1);
    }
  }
}

function chooseCanvas(id) {
  const carouselItem = document.getElementsByClassName('carousel_item');
  for (let n = 0; n < carouselItem.length; n++) {
    carouselItem[n].style.display = 'none';
  }
  // eslint-disable-next-line no-param-reassign
  id.style.display = 'flex';
}

function markSizeButtonAsActive(idButton) {
  const sizeBox = document.getElementsByClassName('size');
  for (let i = 0; i < sizeBox.length; i++) {
    sizeBox[i].classList.remove('active');
  }
  idButton.classList.add('active');
}

function chooseInstrument() {
  const instrumentBox = document.getElementsByClassName('instrument_box');
  const instruments = document.getElementById('instruments');
  instruments.addEventListener('click', (event) => {
    if (event.target.localName === 'div' || event.target.localName === 'img') {
      instrument = event.target.innerText;
      for (let i = 0; i < instrumentBox.length; i++) {
        instrumentBox[i].classList.remove('active');
      }
      event.target.parentNode.classList.add('active');
    }
  });
  window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyQ' && event.altKey) {
      instrument = 'Choose color';
    }
    if (event.code === 'KeyW' && event.altKey) {
      instrument = 'Paint bucket';
    }
    if (event.code === 'KeyA' && event.altKey) {
      instrument = 'Line';
    }
    if (event.code === 'KeyS' && event.altKey) {
      instrument = 'Pencil';
    }
    for (let i = 0; i < instrumentBox.length; i++) {
      if (instrumentBox[i].innerText === instrument) { instrumentBox[i].classList.add('active'); } else {
        instrumentBox[i].classList.remove('active');
      }
    }
  });
}

function chooseColorBox() {
  const colorBox = document.getElementsByClassName('color');
  const colorPalette = document.getElementById('color_palette');
  colorPalette.addEventListener('click', (event) => {
    if (event.target.id !== 'color_palette') {
      color = getComputedStyle(event.target.firstChild.nextSibling).backgroundColor;
      for (let i = 0; i < colorBox.length; i++) {
        colorBox[i].classList.remove('active');
      }
      event.target.classList.add('active');
    }
  });
}

function addCanvasEventListeners(id) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.oImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  let xStart;
  let xFinish;
  let yStart;
  let yFinish;
  function paint(event) {
    const x = event.offsetX / unit;
    const y = event.offsetY / unit;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
    ctx.fill();
  }

  function moveStart(event) {
    ctx.beginPath();
    xStart = event.offsetX / unit;
    yStart = event.offsetY / unit;
    ctx.moveTo(xStart, yStart);
    ctx.strokeStyle = color;
    ctx.lineWidth = '1';
  }

  function moveEnd(event) {
    xFinish = event.offsetX / unit;
    yFinish = event.offsetY / unit;
    ctx.lineTo(xFinish, yFinish);
    ctx.lineCap = 'butt';
    ctx.stroke();
  }

  function chooseColor(event) {
    const x = event.offsetX / unit;
    const y = event.offsetY / unit;
    const imgData = ctx.getImageData(x, y, 1, 1).data;
    const R = imgData[0];
    const G = imgData[1];
    const B = imgData[2];
    const rgb = `${R},${G},${B}`;
    previousColor.style.background = currentColor.style.background;
    currentColor.style.background = `RGB(${rgb})`;
  }

  canvas.onmousedown = function (event) {
    if (instrument === 'Pencil') {
      paint(event);
      // eslint-disable-next-line no-shadow
      canvas.onmousemove = function (event) {
        paint(event);
      };
    }
    if (instrument === 'Line') {
      moveStart(event);
    }
    if (instrument === 'Choose color') {
      chooseColor(event);
    }
    if (instrument === 'Color fill') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 512 / unit, 512 / unit);
      ctx.fill();
    }
  };

  canvas.onmouseup = function (event) {
    if (instrument === 'Line') {
      moveEnd(event);
    }
    canvas.onmousemove = null;
  };
}

function drawImg(url) {
  const canvas = document.getElementById(`can${512 / unit}${512 / unit}`);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512 / unit, 512 / unit);
  ctx.fill();
  const image = new Image();
  image.crossOrigin = 'Anonymous';
  image.src = url;
  image.onload = () => {
    if (image.width > image.height) {
      ctx.drawImage(image, 0, (512 - ((512 * image.height) / image.width)) / (2 * unit), 512 / unit, (((512 * image.height) / image.width) / unit));
    } else {
      ctx.drawImage(image, (512 - ((512 * image.width) / image.height)) / (2 * unit), 0, (((512 * image.width) / image.height) / unit), 512 / unit);
    }
  };
}

async function getLinkToImage() {
  const url = `https://api.unsplash.com/photos/random?query=town,${searchTown}&client_id=9c3230614940bfbaeed09605f3b758cee051f9ece0bfec464e0e9d490d60be10`;
  const response = await fetch(url);
  const data = await response.json();
  linkToImage = `${data.urls.small}`;
  drawImg(linkToImage);
  localStorage.setItem('linkToImage', linkToImage);
}

function drawingSavedImage() {
  if (localStorage.getItem('linkToImage') !== null) {
    linkToImage = localStorage.getItem('linkToImage');
    drawImg(linkToImage);
  }
}

function transformMonochrome() {
  const canvas = document.getElementById(`can${512 / unit}${512 / unit}`);
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < (512 / unit); i++) {
    for (let j = 0; j < (512 / unit); j++) {
      const imgData = ctx.getImageData(j, i, 1, 1).data;
      const R = imgData[0] * 0.3;
      const G = imgData[1] * 0.59;
      const B = imgData[2] * 0.11;
      const avg = 0.3 * R + 0.59 * G + 0.11 * B;
      const rgb = `${avg},${avg},${avg}`;
      ctx.fillStyle = `rgb(${rgb})`;
      ctx.fillRect(j, i, 1, 1);
    }
  }
}

button44.onclick = function () {
  unit = 512 / 4;
  chooseCanvas(li44);
  markSizeButtonAsActive(button44);
  paintingCanvas('can44');
  drawingSavedImage();
  addCanvasEventListeners('can44');
  chooseInstrument();
  chooseColorBox();
};

button3232.onclick = function () {
  unit = 512 / 32;
  chooseCanvas(li3232);
  markSizeButtonAsActive(button3232);
  paintingCanvas('can3232');
  drawingSavedImage();
  addCanvasEventListeners('can3232');
  chooseInstrument();
  chooseColorBox();
};

button128128.onclick = function () {
  unit = 512 / 128;
  chooseCanvas(li128128);
  markSizeButtonAsActive(button128128);
  paintingCanvas('can128128');
  drawingSavedImage();
  addCanvasEventListeners('can128128');
  chooseInstrument();
  chooseColorBox();
};

button512512.onclick = function () {
  unit = 512 / 512;
  chooseCanvas(li512512);
  markSizeButtonAsActive(button512512);
  paintingCanvas('can512512');
  drawingSavedImage();
  addCanvasEventListeners('can512512');
  chooseInstrument();
  chooseColorBox();
};

full.onclick = function () {
  mainContainer.requestFullscreen();
};

getImages.onclick = function () {
  searchTown = document.getElementById('​​searchTown').value;
  getLinkToImage();
};

clearImages.onclick = function () {
  localStorage.clear();
  alert('Choose canvas: "4*4", "32*32", "128*128" или "512*512"');
};

monochromeImage.onclick = function () {
  transformMonochrome();
};

const createNewImage = document.getElementById('createNewImage');
const addingCanvas = document.getElementById('addingCanvas');
const createDuplicateImage = document.getElementById('createDuplicateImage');
const deleteImage = document.getElementById('deleteImage');
const saveImage = document.getElementById('saveImage');
const runImage = document.getElementById('runImage');
const example = document.getElementById('example');
let counterCanvas = 0;
const arrayImgCanvas = [];
let runI = '';
const img = document.createElement('img');
const arrayImgCanvasExample = ['','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAhklEQVRYR+3WsRFAUBCE4f9CiS7UYhQgogqJVCTXA5EKFCJShBLODOaNBniCveTCvfmSPaPDPQPbIMr2CY8WvoFJQAISkIAE/iMwADvnuIGN3xRU6AKqR7hDXsNSfHBEaMPuOiBMC5a8X9FBYO6hXO/4FKx5P/z8P/QPSEACEpCABCQQW+AAazMZfXWTck4AAAAASUVORK5CYII=',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAoUlEQVRYR2P8v5ThP+NtBob/qgwMA0EzMjQw/B8oy8H2jobAaAiMhsBoCIyGwGgIjIbAaAiMhsBoCAy+EEj4xsDwm5MBBDSlrjNcT9OibZMdPQQYGv6DLWdk/M/w/z8jhK5nopkjMPsFdTsZGO66gR0Bccl/hv9LmGjXacGaBo7oMkit2MHw7JMwQ1NgK0OdTjMdQ4De3bTBlwtGQ4DOIQAA87EkfU3gGfIAAAAASUVORK5CYII=',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAb0lEQVRYR+3XwQ2AIBBE0b/0YlcWQzFaFb04RkMoYCUhJsOF42ze7QcVaYNosOTXiZaNNwgLWMACFrCABSxgAQtYwAIWyApof6ICLqAcH8oqU0bvuBhPAZE8IldGtW+XTgBETbblPwVm1nRGYGZN38MxGn04A2o5AAAAAElFTkSuQmCC',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAkUlEQVRYR2P8v5ThP+NtBob/qgwMA0EzMjQw/B8oy8H2jobAaAiMhsBoCIyGwGgIjIbAaAiMhsBoCNArBFIPzmKYfd6Voch6HUOfaTG8FU6XVjFDw38GZPB/KSOiC0CXEIhGdQBDAyN9Q0C4+w3D229CDIwMDAwgp/xfwkTnEMDT86JLGsDb86JLGhgNgcEcAgAIBSB96KaU2gAAAABJRU5ErkJggg==',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAfUlEQVRYR+3Wuw2AMAyE4d8tezAKU1CwQyT6sABbpGUZygxjJB4SRWqnOTcpffoUyWdk3EewCl1eL3i35RVMAhKQgAQkIIFQgcwzBmmCfQGLvIbMb4AvR46+hhvgvxAlWODuHQf4CTaArdECreYV+QdazUuNSAISkIAEJHABAyIafeiVQU8AAAAASUVORK5CYII=',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnUlEQVRYR2P8v5ThP+NtBob/qgwMA0EzMjQw/B8oy8H2Dv8QqDjGwPDYkgEEEu3nM8x3TEKNblqHAGvzL4bff1kZGBn/M/xn/cbwfz4PSlqjfRpo2MTAcNsXHAJg0MBI3xCAJXCThacZzvz+y/C/04LOIUAoi9M6DRDK4rRPA6MhMBoCoyEwGgKjITAaAqMhMBoCoyEwGgKjIUAgBAB07iZ9Q/9hyAAAAABJRU5ErkJggg==',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAmklEQVRYR+3SIQ4CQQyF4b84LrBB4TgFci9CMCRcALEhQMheAs9ROMU4JMGQrO+GsMEh2kW+MTUzee03NY64L8AKROr5AvsnNDNo1/H33zy/4tHw+xbmLz5nAssV3OpcE5YSOAEO2FB3YNOY4CiBxwaqbhAwsEMyvLxnSO5A9Nt+3s/swN/CJSABCUhAAhKQgAQkIAEJSEACBXqxgxx90OPCHAAAAABJRU5ErkJggg==',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVRYR+3TIQ7CQBCF4X/bCiSXqCkOg6/hACiaYAmXIOEeSNIgCBg0aDhAMbUgOQHpLmFJwwmWmjdm5Jt8eWNciTM1uBS62IYVrqtwnyuBViBbV9weGX56T/aLOZP+IXg3fh2YvcAmEFmwkb/DlSZ8MVuBfHfiXOVfASCOG5pl8keBGkabC9f7gOnwyHZcBA/XF0hAAhKQgAQkIAEJSEACEvgIvAHUaCV9XtyTbQAAAABJRU5ErkJggg=='
];

// img.style.display = 'none';
addingCanvas.append(img);

function colorButtonExample() {
  let n = 0;
  function colorButtonExample2() {
    const colorExample = ['red', 'yellow', 'green', 'blue', 'purple'];
    example.style.color = colorExample[n];
    n += 1;
    if (n === colorExample.length) n = 0;
  }
setInterval(colorButtonExample2,200)
}

colorButtonExample();

function createButtonCanvas() {
  const buttonsCanvas = document.getElementsByClassName('button_canvas');
  if (buttonsCanvas) {
    counterCanvas = buttonsCanvas.length + 1;
  } else {
    counterCanvas = 1;
  }
  const imgCanvas = document.createElement('div');
  imgCanvas.className = 'button_canvas';
  imgCanvas.id = `imgCanvas${counterCanvas}`;
  imgCanvas.innerText = `${counterCanvas}`;
  addingCanvas.append(imgCanvas);
};

function saveImageCan() {
    const canvas = document.getElementById('can3232');
    arrayImgCanvas[counterCanvas] = canvas.toDataURL();
    console.log (arrayImgCanvas[counterCanvas])
};

function deleteButtonCanvas() {
  const deleteBlock = document.getElementById(`imgCanvas${counterCanvas}`);
  deleteBlock.style.background = 'red';
  const delBlock = () => deleteBlock.remove();
  setTimeout(delBlock,500);
  arrayImgCanvas.splice(counterCanvas, 1); 
  counterCanvas -= 1;
  const buttonsCanvas = document.getElementsByClassName('button_canvas');
  buttonsCanvas.forEach(function(item) {
    // eslint-disable-next-line no-param-reassign
    if (item.innerText > counterCanvas ) {
      // eslint-disable-next-line no-param-reassign
      item.innerText -= 1;
      // eslint-disable-next-line no-param-reassign
      item.id = `imgCanvas${item.innerText}`;
  }})
};

function runImageFunction(arrayImg) {
  if (runImage.innerText === 'Run') {
    const speedImage = prompt('Введите скорость (от 1 до 20 кадр/сек.)', 3);
    const canvas = document.getElementById('can3232');
    const ctx = canvas.getContext('2d');
    let i = 1;
    // eslint-disable-next-line no-inner-declarations
    function runImg() {
      img.src = arrayImg[i];
      ctx.drawImage (img, 0, -0.05);
      i += 1;
      if (i === arrayImg.length ) i = 1;
    }
    runI = setInterval (runImg, 1000 / speedImage);
    runImage.innerText = 'Stop';
  } else {
    clearInterval(runI);
    runImage.innerText = 'Run';
  }
}

function createImage() {
  createButtonCanvas()
  unit = 512 / 32;
  chooseCanvas(li3232);
  paintingCanvas('can3232');
  addCanvasEventListeners('can3232');
  chooseInstrument();
  chooseColorBox();
  saveImageCan();
}

createNewImage.onclick = function () {
  createImage();
};

createDuplicateImage.onclick = function () {
  // eslint-disable-next-line no-unused-vars
  const duplicateNumber = prompt('Введите номер дубликата', 3);
  createImage();
  const canvas = document.getElementById('can3232');
  const ctx = canvas.getContext('2d');
  img.src = arrayImgCanvas[duplicateNumber];
  arrayImgCanvas[counterCanvas] = arrayImgCanvas[duplicateNumber];
  ctx.drawImage (img, 0, -0.05);
  console.log (arrayImgCanvas)
};

deleteImage.onclick = function() {
  deleteButtonCanvas()
};

saveImage.onclick = function() {
  saveImageCan();
};

addingCanvas.onclick =  function(event) {
  if (event.target.innerText > 0) {
    const canvas = document.getElementById('can3232');
    const ctx = canvas.getContext('2d');
    counterCanvas = event.target.innerText;
    img.src = arrayImgCanvas[counterCanvas]
    ctx.drawImage (img, 0, -0.05);
  }
};

runImage.onclick =  function() {
  runImageFunction(arrayImgCanvas);
};

/*example.onclick =  function() {
  const canvas = document.getElementById(`can${512 / unit}${512 / unit}`);
  const ctx = canvas.getContext('2d');
  img.src = './mario/03.png';
  ctx.drawImage (img, 0, -0.05, 128, 128);
  console.log (canvas.toDataURL());
};*/

example.onclick =  function() {
  chooseCanvas(li3232);
  runImageFunction(arrayImgCanvasExample);
};

