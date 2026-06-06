// ------------------------------------------------------
// Charm Capsule — Snapshot Viewer Engine
// Supports HTML + JSON snapshots with graceful fallback
// ------------------------------------------------------

function getSnapshotId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchText(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function loadSnapshot() {
  const id = getSnapshotId();
  const container = document.getElementById("snapshot-container");

  if (!container) {
    console.error("Snapshot container not found.");
    return;
  }

  if (!id) {
    container.innerHTML = `<p>No snapshot ID provided.</p>`;
    return;
  }

  const htmlPath = `${id}.html`;
  const jsonPath = `${id}.json`;

  // Try HTML snapshot first
  const htmlContent = await fetchText(htmlPath);

  if (htmlContent) {
    container.innerHTML = `
      <iframe src="${htmlPath}" class="snapshot-frame"></iframe>
    `;
    return;
  }

  // Try JSON snapshot
  const jsonContent = await fetchJson(jsonPath);

  if (jsonContent) {
    container.innerHTML = `
      <pre class="snapshot-json">${JSON.stringify(jsonContent, null, 2)}</pre>
    `;
    return;
  }

  // Nothing found
  container.innerHTML = `
    <p style="opacity:0.7;">
      Snapshot <strong>${id}</strong> not found.<br>
      Ensure <code>${id}.html</code> or <code>${id}.json</code> exists.
    </p>
  `;
}

// Auto‑init
document.addEventListener("DOMContentLoaded", loadSnapshot);

// Re-run when SPA router loads this page dynamically
window.addEventListener("charm:router:navigate", loadSnapshot);
