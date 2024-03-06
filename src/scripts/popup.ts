/* eslint-disable @typescript-eslint/no-explicit-any */

const colorPickerState = {
  drag: false,
  rgbaColor: 'rgba(255,0,0,1)',
};

const colorBlock: any = document.getElementById('color-picker');
const ctx_colorBlock = colorBlock.getContext('2d');
const colorBlockWidth = colorBlock.width;
const colorBlockHeight = colorBlock.height;

const hueBar: any = document.getElementById('color-hue-bar');
const ctx_hueBar = hueBar.getContext('2d');
const hueBarWidth = hueBar.width;
const hueBarHeight = hueBar.height;

ctx_colorBlock.rect(0, 0, colorBlockWidth, colorBlockHeight);
fillColorBlockGradient();

ctx_hueBar.rect(0, 0, hueBarWidth, hueBarHeight);
const grd1 = ctx_hueBar.createLinearGradient(0, 0, 0, colorBlockHeight);
grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
ctx_hueBar.fillStyle = grd1;
ctx_hueBar.fill();

function fillColorBlockGradient() {
  ctx_colorBlock.fillStyle = colorPickerState.rgbaColor;
  ctx_colorBlock.fillRect(0, 0, colorBlockWidth, colorBlockHeight);

  const grdWhite = ctx_hueBar.createLinearGradient(0, 0, colorBlockWidth, 0);
  grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
  grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
  ctx_colorBlock.fillStyle = grdWhite;
  ctx_colorBlock.fillRect(0, 0, colorBlockWidth, colorBlockHeight);

  const grdBlack = ctx_hueBar.createLinearGradient(0, 0, 0, colorBlockHeight);
  grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
  grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
  ctx_colorBlock.fillStyle = grdBlack;
  ctx_colorBlock.fillRect(0, 0, colorBlockWidth, colorBlockHeight);
}
