import { hexToRgb } from '../utils/hexToRgb';
import { rgbToHex } from '../utils/rgbToHex';

const hueBarState = {
  x: 0,
  y: 0,
};

const colorPickerState = {
  x: 0,
  y: 0,
  isDragging: false,
  rgbColor: 'rgb(255, 0, 0)',
  colorType: 'hex',
};

const colorTypeSelect = document.querySelector<HTMLSelectElement>('#color-type-select');
const displayColorValue = document.querySelector<HTMLDivElement>('.content__display-value');
const copyValueBtn = document.querySelector<HTMLButtonElement>('#copy-value-btn');

const colorPicker = document.querySelector<HTMLCanvasElement>('#color-picker');
const colorPickerCtx = colorPicker.getContext('2d');
const colorPickerWidth = colorPicker.width;
const colorPickerHeight = colorPicker.height;

const hueBar = document.querySelector<HTMLCanvasElement>('#color-hue-bar');
const hueBarCtx = hueBar.getContext('2d');
const hueBarWidth = hueBar.width;
const hueBarHeight = hueBar.height;

colorPickerCtx.rect(0, 0, colorPickerWidth, colorPickerHeight);
setColorPickerGradient();

hueBarCtx.rect(0, 0, hueBarWidth, hueBarHeight);

const grd1 = hueBarCtx.createLinearGradient(0, 0, 0, colorPickerHeight);
grd1.addColorStop(0, 'rgb(255, 0, 0)');
grd1.addColorStop(0.17, 'rgb(255, 255, 0)');
grd1.addColorStop(0.34, 'rgb(0, 255, 0)');
grd1.addColorStop(0.51, 'rgb(0, 255, 255)');
grd1.addColorStop(0.68, 'rgb(0, 0, 255)');
grd1.addColorStop(0.85, 'rgb(255, 0, 255)');
grd1.addColorStop(1, 'rgb(255, 0, 0)');

hueBarCtx.fillStyle = grd1;
hueBarCtx.fill();

function hueBarClickHandler(event: MouseEvent) {
  hueBarState.x = event.offsetX;
  hueBarState.y = event.offsetY;

  const [r, g, b] = hueBarCtx.getImageData(hueBarState.x, hueBarState.y, 1, 1).data;
  colorPickerState.rgbColor = 'rgb(' + r + ',' + g + ',' + b + ')';

  setColorPickerGradient();
  setColor(event);
}

// Functions for color picker functionality

function setColorPickerGradient() {
  colorPickerCtx.fillStyle = colorPickerState.rgbColor;
  colorPickerCtx.fillRect(0, 0, colorPickerWidth, colorPickerHeight);

  const grdWhite = hueBarCtx.createLinearGradient(0, 0, colorPickerWidth, 0);
  grdWhite.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grdWhite.addColorStop(1, 'rgba(255, 255, 255, 0)');

  colorPickerCtx.fillStyle = grdWhite;
  colorPickerCtx.fillRect(0, 0, colorPickerWidth, colorPickerHeight);

  const grdBlack = hueBarCtx.createLinearGradient(0, 0, 0, colorPickerHeight);
  grdBlack.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grdBlack.addColorStop(1, 'rgba(0, 0, 0, 1)');

  colorPickerCtx.fillStyle = grdBlack;
  colorPickerCtx.fillRect(0, 0, colorPickerWidth, colorPickerHeight);
}

function setColor(event: MouseEvent) {
  colorPickerState.x = event.offsetX;
  colorPickerState.y = event.offsetY;

  const [r, g, b] = colorPickerCtx.getImageData(colorPickerState.x, colorPickerState.y, 1, 1).data;

  colorPickerState.rgbColor = 'rgb(' + r + ',' + g + ',' + b + ')';

  const hex = rgbToHex(r, g, b);

  displayColorValue.textContent =
    colorPickerState.colorType === 'hex' ? hex : `RGB(${r}, ${g}, ${b})`;
}

// Event handlers for color picker

function colorPickerMouseDownHandler(event: MouseEvent) {
  event.preventDefault();

  colorPickerState.isDragging = true;

  setColor(event);
}

function colorPickerMouseMoveHandler(event: MouseEvent) {
  if (colorPickerState.isDragging) {
    setColor(event);
  }
}

function colorPickerMouseOutHandler() {
  colorPickerState.isDragging = false;
}

function colorPickerMouseUpHandler() {
  colorPickerState.isDragging = false;
}

// Event handlers for hue bar

function hueBarMouseDownHandler(event: MouseEvent) {
  event.preventDefault();

  colorPickerState.isDragging = true;

  hueBarClickHandler(event);
}

function hueBarMouseMoveHandler(event: MouseEvent) {
  if (colorPickerState.isDragging) {
    hueBarClickHandler(event);
  }
}

function hueBarMouseOutHandler() {
  colorPickerState.isDragging = false;
}

function hueBarMouseUpHandler() {
  colorPickerState.isDragging = false;
}

// Event handlers for color type select

function colorTypeSelectValueChangeHandler(event: Event) {
  const { value } = event.target as HTMLSelectElement;
  colorPickerState.colorType = value;

  if (value === 'hex') {
    const rgbRegex = /(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/;
    const [r, g, b] = displayColorValue.textContent.match(rgbRegex);

    displayColorValue.textContent = rgbToHex(Number(r), Number(g), Number(b));

    return;
  }

  const { r, g, b } = hexToRgb(displayColorValue.textContent);

  displayColorValue.textContent = `RGB(${r}, ${g}, ${b})`;
}

// Event handlers for copy value button

function copyValueButtonClickHandler() {
  navigator.clipboard.writeText(displayColorValue.textContent);
}

// Events

colorPicker.addEventListener('mousedown', colorPickerMouseDownHandler, false);
colorPicker.addEventListener('mousemove', colorPickerMouseMoveHandler, false);
colorPicker.addEventListener('mouseout', colorPickerMouseOutHandler, false);
colorPicker.addEventListener('mouseup', colorPickerMouseUpHandler, true);

hueBar.addEventListener('mousedown', hueBarMouseDownHandler, false);
hueBar.addEventListener('mousemove', hueBarMouseMoveHandler, false);
hueBar.addEventListener('mouseout', hueBarMouseOutHandler, false);
hueBar.addEventListener('mouseup', hueBarMouseUpHandler, false);

colorTypeSelect.addEventListener('change', colorTypeSelectValueChangeHandler);

copyValueBtn.addEventListener('click', copyValueButtonClickHandler);
