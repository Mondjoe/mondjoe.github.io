// -------------------------------------------
// Charm Capsule — Optional SPA Router
// Works with multi-page PWA + GitHub Pages
// -------------------------------------------

// Pages you want to load dynamically
const ROUTES = {
  "/": "/index.html",
  "/index.html": "/index.html",
  "/dashboard": "/dashboard.html",
  "/dashboard.html": "/dashboard.html",
  "/about": "/about.html",
  "/about.html": "/about.html",
  "/settings": "/settings.html",
  "/settings.html": "/settings.html"
};

// Load page content into the current DOM
async function loadPage(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    // Extract <body> content only
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newBody = doc.body.innerHTML;

    document.body.innerHTML = newBody;

    // Re-run dashboard logic if needed
    if (url.includes("dashboard")) {
      if (window.loadDashboard) loadDashboard();
    }

    // Re-bind router links
    bindRouterLinks();

  } catch (err) {
    console.error("Router load error:", err);
    location.href = url; // fallback to full navigation
  }
}

// Intercept clicks on internal links
function bindRouterLinks() {
  document.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("http") || href.startsWith("#")) return;

    link.addEventListener("click", (e) => {
      e.preventDefault();

      const route = ROUTES[href] || href;

      history.pushState({}, "", route);
      loadPage(route);
    });
  });
}

// Handle browser back/forward
window.addEventListener("popstate", () => {
  const path = location.pathname;
  const route = ROUTES[path] || path;
  loadPage(route);
});

// Initialize router
document.addEventListener("DOMContentLoaded", () => {
  bindRouterLinks();
});
