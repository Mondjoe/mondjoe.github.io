// -------------------------------------------
// Charm Capsule — Dashboard Logic
// Future: Multi‑Chain Validator Viewer Engine
// -------------------------------------------

// Placeholder API endpoints (replace later)
const API_CONFIG = {
  validatorEndpoint: "https://api.example.com/validators",
  snapshotsEndpoint: "https://api.example.com/snapshots",
  governanceEndpoint: "https://api.example.com/governance"
};

// Generic JSON fetcher
async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

// Main dashboard loader
async function loadDashboard() {
  const statusCard = document.querySelector("[data-card='status']");
  const snapshotsCard = document.querySelector("[data-card='snapshots']");
  const governanceCard = document.querySelector("[data-card='governance']");

  if (!statusCard || !snapshotsCard || !governanceCard) {
    console.warn("Dashboard cards not found in DOM.");
    return;
  }

  // -------------------------
  // 1. Validator Status
  // -------------------------
  const validators = await fetchJson(API_CONFIG.validatorEndpoint);

  if (validators && Array.isArray(validators) && validators.length > 0) {
    statusCard.querySelector("[data-field='status-body']").textContent =
      `Tracking ${validators.length} validators across chains.`;
  } else {
    statusCard.querySelector("[data-field='status-body']").textContent =
      "Validator data not available yet.";
  }

  // -------------------------
  // 2. Snapshots
  // -------------------------
  const snapshots = await fetchJson(API_CONFIG.snapshotsEndpoint);

  if (snapshots && Array.isArray(snapshots) && snapshots.length > 0) {
    const latest = snapshots[0];
    snapshotsCard.querySelector("[data-field='snapshots-body']").textContent =
      `Latest snapshot: ${latest.id || "unknown"} • ${latest.chain || "multi‑chain"}`;
  } else {
    snapshotsCard.querySelector("[data-field='snapshots-body']").textContent =
      "No snapshots available yet.";
  }

  // -------------------------
  // 3. Governance
  // -------------------------
  const governance = await fetchJson(API_CONFIG.governanceEndpoint);

  if (governance && Array.isArray(governance) && governance.length > 0) {
    governanceCard.querySelector("[data-field='governance-body']").textContent =
      `Active proposals: ${governance.length}`;
  } else {
    governanceCard.querySelector("[data-field='governance-body']").textContent =
      "No active governance proposals.";
  }
}

// Auto‑init when dashboard loads
document.addEventListener("DOMContentLoaded", loadDashboard);
