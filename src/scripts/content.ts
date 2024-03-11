chrome.runtime.onMessage.addListener(request => {
  if (request.message === 'start') {
    setTimeout(start, 500);
  }
});

async function start() {
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
