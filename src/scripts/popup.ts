import { ChromeStorageService } from 'src/services/ChromeStorageService';
import { getCanvasPixelColor } from 'src/utils/getCanvasPixelColor';
import { hexToRgb } from 'src/utils/hexToRgb';
import { rgbToHex } from 'src/utils/rgbToHex';

const colorPickerState = {
  x: 296,
  y: 30,
  isDragging: false,
  rgbColor: 'rgb(255, 0, 0)',
  colorType: 'hex',
};

const pickPageColorBtn = document.querySelector<HTMLButtonElement>('#pick-color-btn');
const colorValueWrapper = document.querySelector<HTMLDivElement>('.color-value-wrapper');
const colorTypeSelect = document.querySelector<HTMLSelectElement>('#color-type-select');
const colorValue = document.querySelector<HTMLDivElement>('.color-value');
const copyValueBtn = document.querySelector<HTMLButtonElement>('#copy-value-btn');
const colorSlider = document.querySelector<HTMLDivElement>('#color-slider');
const hueSlider = document.querySelector<HTMLDivElement>('#hue-slider');

const colorPicker = document.querySelector<HTMLCanvasElement>('#color-picker');
const colorPickerCtx = colorPicker.getContext('2d');
const colorPickerWidth = colorPicker.width;
const colorPickerHeight = colorPicker.height;

const hueBar = document.querySelector<HTMLCanvasElement>('#color-hue-bar');
const hueBarCtx = hueBar.getContext('2d');
const hueBarWidth = hueBar.width;
const hueBarHeight = hueBar.height;

colorPickerCtx.rect(0, 0, colorPickerWidth, colorPickerHeight);
init();

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

// Main functions

function init() {
  ChromeStorageService.get(
    ['color', 'colorSliderPosition', 'hueSliderPosition', 'colorPickerRgbColor'],
    data => {
      const {
        color = '#d81616',
        colorSliderPosition = { x: colorPickerState.x, y: colorPickerState.y },
        hueSliderPosition,
        colorPickerRgbColor = colorPickerState.rgbColor,
      } = data;

      updateBadge({ color });

      colorValue.textContent = color;
      colorPickerState.rgbColor = colorPickerRgbColor;
      colorPickerState.x = colorSliderPosition.x;
      colorPickerState.y = colorSliderPosition.y;

      colorSlider.style.top = `${colorSliderPosition.y - colorSlider.clientHeight / 2}px`;
      colorSlider.style.left = `${colorSliderPosition.x - colorSlider.clientWidth / 2}px`;

      hueSlider.style.top = `${hueSliderPosition?.y - hueSlider.clientHeight / 2}px`;

      setColorPickerGradient(colorPickerRgbColor);
    }
  );
}

function setColorPickerGradient(rgbColor: string) {
  colorPickerCtx.fillStyle = rgbColor;
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

function setColor() {
  const [r, g, b] = getCanvasPixelColor(colorPickerCtx, colorPickerState.x, colorPickerState.y);

  const hex = rgbToHex(r, g, b);

  colorValue.textContent = colorPickerState.colorType === 'hex' ? hex : `RGB(${r}, ${g}, ${b})`;

  updateBadge({ color: hex });
}

function displayCopySuccessTooltip(element: HTMLElement, text: string, timeToLive: number) {
  const tooltip = document.createElement('div');
  tooltip.classList.add('copy-tooltip');
  tooltip.textContent = text;

  element.appendChild(tooltip);

  setTimeout(() => tooltip.remove(), timeToLive);
}

function setSliderPosition(
  element: HTMLElement,
  x: number,
  y: number,
  options: { horizontal?: boolean; vertical?: boolean } = { horizontal: true, vertical: true }
) {
  const { horizontal = true, vertical = true } = options;

  if (horizontal || vertical) {
    element.style.top = vertical ? `${y - element.clientHeight / 2}px` : element.style.top;
    element.style.left = horizontal ? `${x - element.clientWidth / 2}px` : element.style.left;
  }
}

async function updateBadge({ text = '\n', color }: { text?: string; color?: string }) {
  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({ color });
}

// Event handlers

function pickPageColorButtonClickHandler() {
  ChromeStorageService.clear();
}

function colorPickerMouseDownHandler({ offsetX, offsetY }: MouseEvent) {
  colorPickerState.isDragging = true;
  colorPickerState.x = offsetX;
  colorPickerState.y = offsetY;

  setSliderPosition(colorSlider, offsetX, offsetY);
  setColor();
}

function colorPickerMouseMoveHandler({ offsetX, offsetY }: MouseEvent) {
  if (colorPickerState.isDragging) {
    colorPickerState.x = offsetX;
    colorPickerState.y = offsetY;

    setSliderPosition(colorSlider, offsetX, offsetY);
    setColor();
  }
}

function colorPickerMouseOutHandler() {
  colorPickerState.isDragging = false;
}

function colorPickerMouseUpHandler({ offsetX, offsetY }: MouseEvent) {
  const [r, g, b] = getCanvasPixelColor(colorPickerCtx, offsetX, offsetY);

  colorPickerState.isDragging = false;
  colorPickerState.x = offsetX;
  colorPickerState.y = offsetY;
  colorPickerState.rgbColor = `rgb(${r}, ${g}, ${b})`;

  const hex = rgbToHex(r, g, b);

  setColor();

  ChromeStorageService.set('color', hex);
  ChromeStorageService.set('colorSliderPosition', { x: offsetX, y: offsetY });
}

function hueBarClickHandler({ offsetX, offsetY }: MouseEvent) {
  const [r, g, b] = getCanvasPixelColor(hueBarCtx, offsetX, offsetY);
  const rgbString = `rgb(${r}, ${g}, ${b})`;

  setColorPickerGradient(rgbString);
  setSliderPosition(hueSlider, offsetX, offsetY, { horizontal: false });
  setColor();
}

function hueBarMouseDownHandler(event: MouseEvent) {
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

function hueBarMouseUpHandler({ offsetX, offsetY }: MouseEvent) {
  const [hueR, hueG, hueB] = getCanvasPixelColor(hueBarCtx, offsetX, offsetY);
  const [pickerR, pickerG, pickerB] = getCanvasPixelColor(
    colorPickerCtx,
    colorPickerState.x,
    colorPickerState.y
  );
  const rgbString = `rgb(${hueR}, ${hueG}, ${hueB})`;

  colorPickerState.isDragging = false;

  setColor();
  setColorPickerGradient(rgbString);

  ChromeStorageService.set('color', rgbToHex(pickerR, pickerG, pickerB));
  ChromeStorageService.set('hueSliderPosition', { y: offsetY });
  ChromeStorageService.set('colorPickerRgbColor', rgbString);
}

function colorTypeSelectValueChangeHandler(event: Event) {
  const { value } = event.target as HTMLSelectElement;
  colorPickerState.colorType = value;

  if (value === 'hex') {
    const rgbRegex = /RGB\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
    const [, r, g, b] = colorValue.textContent.match(rgbRegex);

    colorValue.textContent = rgbToHex(Number(r), Number(g), Number(b));

    return;
  }

  const { r, g, b } = hexToRgb(colorValue.textContent);

  colorValue.textContent = `RGB(${r}, ${g}, ${b})`;
}

function copyValueButtonClickHandler() {
  navigator.clipboard.writeText(colorValue.textContent);

  displayCopySuccessTooltip(colorValueWrapper, 'Copied!', 2500);
}

// Events

pickPageColorBtn.addEventListener('click', pickPageColorButtonClickHandler);

colorPicker.addEventListener('mousedown', colorPickerMouseDownHandler);
colorPicker.addEventListener('mousemove', colorPickerMouseMoveHandler);
colorPicker.addEventListener('mouseout', colorPickerMouseOutHandler);
colorPicker.addEventListener('mouseup', colorPickerMouseUpHandler);

hueBar.addEventListener('mousedown', hueBarMouseDownHandler);
hueBar.addEventListener('mousemove', hueBarMouseMoveHandler);
hueBar.addEventListener('mouseout', hueBarMouseOutHandler);
hueBar.addEventListener('mouseup', hueBarMouseUpHandler);

colorTypeSelect.addEventListener('change', colorTypeSelectValueChangeHandler);

copyValueBtn.addEventListener('click', copyValueButtonClickHandler);
