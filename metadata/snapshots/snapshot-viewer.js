// ------------------------------------------------------
// Charm Capsule — Snapshot Viewer Engine (Final Version)
// Supports HTML + JSON snapshots with graceful fallback
// Works with SPA router + sovereign metadata structure
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

async function loadSnapshotViewer(id) {
  const container = document.getElementById("snapshot-viewer-container");
  if (!container) return;

  if (!id) {
    container.innerHTML = `<div class="error-box">No snapshot ID provided.</div>`;
    return;
  }

  const htmlPath = `metadata/snapshots/${id}.html`;
  const jsonPath = `metadata/snapshots/${id}.json`;

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
    <div class="error-box">
      Snapshot <strong>${id}</strong> not found.<br>
      Ensure <code>${id}.html</code> or <code>${id}.json</code> exists in <code>metadata/snapshots/</code>.
    </div>
  `;
}

// Auto‑init for direct page loads
document.addEventListener("DOMContentLoaded", () => {
  const id = getSnapshotId();
  if (id) loadSnapshotViewer(id);
});

// Re-run when SPA router navigates to this page
window.addEventListener("charm:router:navigate", () => {
  const id = getSnapshotId();
  if (id) loadSnapshotViewer(id);
});
