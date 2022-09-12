// * The codes olny for Extension development
const btn = document.getElementById("picker-btn");
const colors = document.getElementById("colors");
const errorMsg = document.getElementById("error_message");

btn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },
    async (injectedResult) => {
      const [data] = injectedResult;
      if (data.result) {
        const color = data.result.sRGBHex;
        const li = document.createElement("li");
        const div = document.createElement("div");
        const span = document.createElement("span");
        span.classList.add("colorgrid");
        div.style.border = `2px solid ${color}`;
        div.classList.add("color");
        span.style.backgroundColor = color;
        li.innerText += color;
        div.append(li, span);
        colors.appendChild(div);
        try {
          await navigator.clipboard.writeText(color);
        } catch (err) {
          errorMsg.innerText = err.message;
        }
      }
    }
  );
});

// * The functions will olny run web pages in the browser window
async function pickColor() {
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    errorMsg.innerText = err.message;
  }
}
