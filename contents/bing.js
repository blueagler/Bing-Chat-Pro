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
async function init() {
  removeCharLimit();
}
window.addEventListener("load", init);
window.addEventListener("popstate", init);