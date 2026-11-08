// Google Analytics 4, loaded only after the visitor accepts analytics cookies.
// The measurement ID is filled in at build time (vite.config.mjs); without one,
// nothing here runs and no banner is shown.
(() => {
  const ID = "__GA_MEASUREMENT_ID__";
  if (!/^G-[A-Z0-9]+$/.test(ID)) return;

  const KEY = "linguastar-analytics-consent";
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const write = (value) => { try { localStorage.setItem(KEY, value); } catch { /* private mode */ } };
  const base = new URL(".", document.currentScript.src).href;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  let loaded = false;

  function load() {
    window[`ga-disable-${ID}`] = false;
    if (loaded) return;
    loaded = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
    document.head.appendChild(script);
    window.gtag("js", new Date());
    window.gtag("config", ID);
  }

  function stop() {
    // Stop sending and remove the cookies Google Analytics set.
    window[`ga-disable-${ID}`] = true;
    const host = location.hostname;
    const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
    for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n === "_ga" || n.startsWith("_ga_"))) {
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
      }
    }
  }

  const style = document.createElement("style");
  style.textContent = `
    .ls-consent { position: fixed; z-index: 120; right: 16px; bottom: 16px; left: 16px; max-width: 460px; padding: 20px 22px; border: 1px solid rgba(255,255,255,.9); border-radius: 22px; background: rgba(255,251,250,.97); box-shadow: 0 20px 60px rgba(59,69,146,.22); color: #10182f; font-family: inherit; }
    .ls-consent p { margin: 0 0 16px; color: #4a5268; font-size: 14px; line-height: 1.55; }
    .ls-consent strong { display: block; margin-bottom: 6px; color: #10182f; font-size: 15px; }
    .ls-consent a { color: #3351aa; text-decoration: underline; text-underline-offset: 3px; }
    .ls-consent div { display: flex; gap: 10px; }
    .ls-consent button { flex: 1; min-height: 44px; padding: 0 18px; border: 0; border-radius: 999px; background: #4b6fd5; color: #fff; font: inherit; font-size: 14px; font-weight: 750; cursor: pointer; }
    .ls-consent button:hover { background: #3351aa; }
    .ls-consent button:focus-visible { outline: 3px solid #3351aa; outline-offset: 3px; }
  `;
  document.head.appendChild(style);

  let banner = null;
  function showBanner() {
    if (banner) return banner.querySelector("button").focus();
    banner = document.createElement("section");
    banner.className = "ls-consent";
    banner.setAttribute("aria-label", "Cookie choice");
    banner.innerHTML = `
      <p><strong>Analytics cookies</strong>We’d like to use Google Analytics cookies to see how visitors use this site and which links lead to the App Store. See our <a href="${base}privacy-policy.html">Privacy Policy</a>.</p>
      <div><button type="button" data-choice="denied">Decline</button><button type="button" data-choice="granted">Accept</button></div>`;
    banner.addEventListener("click", (event) => {
      const choice = event.target.closest("button")?.dataset.choice;
      if (!choice) return;
      write(choice);
      if (choice === "granted") load(); else stop();
      banner.remove();
      banner = null;
    });
    document.body.appendChild(banner);
  }

  function track(name, params) {
    if (read() === "granted") window.gtag("event", name, params);
  }

  // App Store links carry their placement in the campaign token (ct=website_global_<placement>).
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href*="apps.apple.com"]');
    if (!link) return;
    const ct = new URL(link.href).searchParams.get("ct") || "";
    track("app_store_click", { placement: ct.replace(/^website_global_/, "") || "unknown" });
  }, true);

  window.linguastarAnalytics = { openSettings: showBanner, track };

  const choice = read();
  if (choice === "granted") load();
  else if (choice !== "denied") {
    if (document.body) showBanner();
    else document.addEventListener("DOMContentLoaded", showBanner, { once: true });
  }
})();
