export const config = {
  matches: ["*://www.bing.com/search*"],
}

async function waitForElement(root, selector) {
  return new Promise((resolve, reject) => {
    if (root.querySelector(selector)) {
      resolve(root.querySelector(selector));
    } else {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            if (root.querySelector(selector)) {
              resolve(root.querySelector(selector));
              observer.disconnect();
              clearTimeout(timeout);
            }
          }
        });
      });
      observer.observe(root, { childList: true, subtree: true });
      const timeout = setTimeout(() => {
        observer.disconnect();
        reject(new Error("Timeout"));
      }, 10000);
    }
  });
}
async function removeCharLimit() {
  const serp = await waitForElement(document, "cib-serp[serp-slot='none']");
  const serpShadowRoot = serp.shadowRoot;
  const actionBar = await waitForElement(serpShadowRoot, "cib-action-bar");
  const actionBarShadowRoot = actionBar.shadowRoot;
  const textarea = await waitForElement(actionBarShadowRoot, "textarea[maxlength]");
  textarea.removeAttribute("maxlength");
  const letterCounter = await waitForElement(actionBarShadowRoot, ".letter-counter");
  letterCounter.childNodes[letterCounter.childNodes.length - 1].textContent = "∞";
}

function loadUmami() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.setAttribute("src", "https://umami.blueagle.top/blueagle.js");
    script.setAttribute("data-website-id", "34d9f833-dc46-4139-9253-c33ce3582aec");
    script.async = true;
    script.onload = resolve;
    script.onerror = function () {
      reject("Umami script failed to load");
    }
    document.documentElement.appendChild(script);
  });
}

async function init() {
  removeCharLimit();
  try {
    await loadUmami();
  } catch (e) {
    console.error(e);
  }
}
window.addEventListener("load", init);
window.addEventListener("popstate", init);