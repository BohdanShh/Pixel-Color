// import html2canvas from 'html2canvas';
import { createElement } from 'src/utils/createElement';
// import { getCanvasPixelColor } from 'src/utils/getCanvasPixelColor';

chrome.runtime.onMessage.addListener(request => {
  if (request.message === 'start') {
    setTimeout(start, 500);
  }
});

async function start() {
  const body = document.body;
  const colorBadge = createElement('div', { classList: ['color-badge'] });
  const colorValueHex = createElement('div', { textContent: '#ffffff' });
  const colorValueRgb = createElement('div', { textContent: 'RGB(255, 255, 255)' });
  const colorValue = createElement('div', {
    classList: ['color-value'],
    children: [colorValueHex, colorValueRgb],
  });
  const colorPreviewElement = createElement('div', {
    classList: ['color-preview'],
    children: [colorBadge, colorValue],
  });

  body.append(colorPreviewElement);

  // html2canvas(body).then(canvas => {
  //   document.addEventListener('click', event => {
  //     const pixelColor = getCanvasPixelColor(canvas.getContext('2d'), event.offsetX, event.offsetY);

  //     console.log(pixelColor);
  //   });
  // });

  if (!('EyeDropper' in window)) {
    alert('Your browser does not support EyeDropper API');

    return;
  }

  const dropper = new EyeDropper();
  const colorFromPage = (await dropper.open()).sRGBHex;

  chrome.storage.sync.get('recentColors', data => {
    const recentColors = data.recentColors || [];
    recentColors.push(colorFromPage);

    chrome.storage.sync.set({
      color: colorFromPage,
      recentColors,
    });
  });
}
