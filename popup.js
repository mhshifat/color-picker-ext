const changeColorBtn = document.querySelector(".changeColorBtn");
const colorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue");

changeColorBtn.addEventListener("click", async () => {
  chrome.storage.sync.get("color", ({ color }) => {
    console.log(color);
  });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    function: pickColor,
  }, async (injectionResults) => {
    const [{ result }] = injectionResults;
    if (!result) return;
    colorGrid.style.background = result.sRGBHex;
    colorValue.innerText = result.sRGBHex;

    try {
      await navigator.clipboard.writeText(result.sRGBHex);
    } catch (err) {
      console.error(err);
    }
  })
});

async function pickColor() {
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    console.error(err);
  }
}