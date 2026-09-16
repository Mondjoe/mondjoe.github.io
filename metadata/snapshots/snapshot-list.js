/* -----------------------------------------------------------
   Charm Capsule — Snapshot List Loader
   File: snapshot-list.js
   Purpose: Load snapshot-list.json and render snapshot cards
----------------------------------------------------------- */

const SNAPSHOT_LIST_URL = "metadata/snapshots/snapshot-list.json";

async function fetchJsonSafe(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function renderSnapshotListRoot(list) {
  const container = document.getElementById("snapshot-list-container");
  if (!container) return;

  if (!list || !list.length) {
    container.innerHTML = `
      <div class="error-box">
        No snapshots found in <code>snapshot-list.json</code>.
      </div>
    `;
    return;
  }

  container.innerHTML = list
    .map(
      (snap) => `
      <div class="snapshot-card">
        <h2>Snapshot ${snap.id}</h2>
        <div class="snapshot-meta">
          <div><strong>Network:</strong> ${snap.network}</div>
          <div><strong>Status:</strong> ${snap.status}</div>
          <div><strong>Timestamp:</strong> ${snap.timestamp}</div>
        </div>

        <div class="snapshot-actions">
          <button class="snapshot-btn"
            onclick="router.navigate('#/snapshot?id=${snap.id}')">
            View Snapshot
          </button>

          <a class="snapshot-btn" href="metadata/snapshots/${snap.json}" target="_blank">
            Raw JSON
          </a>

          <a class="snapshot-btn" href="metadata/snapshots/${snap.file}" target="_blank">
            Raw HTML
          </a>
        </div>
      </div>
    `
    )
    .join("");
}

window.loadSnapshotList = async function () {
  const container = document.getElementById("snapshot-list-container");
  if (!container) return;

  container.innerHTML = `
    <div class="snapshot-card">
      <h2>Loading snapshots…</h2>
      <p>Please wait.</p>
    </div>
  `;

  const list = await fetchJsonSafe(SNAPSHOT_LIST_URL);

  if (!list) {
    container.innerHTML = `
      <div class="error-box">
        Failed to load <code>snapshot-list.json</code>.
      </div>
    `;
    return;
  }

  renderSnapshotListRoot(list);
};
