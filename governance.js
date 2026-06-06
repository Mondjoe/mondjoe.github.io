// -------------------------------------------
// Charm Capsule — Governance Engine Foundation
// Proposal registry, states, filters, storage
// -------------------------------------------

// Basic proposal shape:
//
// {
//   id: "prop-001",
//   title: "Increase validator commission to 7%",
//   description: "Rationale, impact, and constraints...",
//   chain: "cosmos-hub",
//   status: "active" | "passed" | "rejected" | "withdrawn",
//   createdAt: "2025-01-01T12:00:00Z",
//   snapshotId: "snap-001",
//   metadataHash: "0x...",
//   tags: ["commission", "economics"]
// }

const GOVERNANCE_STORAGE_KEY = "charm-governance-proposals";

// In‑memory cache
let proposals = [];

// Load from localStorage
function loadProposalsFromStorage() {
  try {
    const raw = localStorage.getItem(GOVERNANCE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("Failed to load proposals from storage:", e);
    return [];
  }
}

// Save to localStorage
function saveProposalsToStorage() {
  try {
    localStorage.setItem(GOVERNANCE_STORAGE_KEY, JSON.stringify(proposals));
  } catch (e) {
    console.error("Failed to save proposals to storage:", e);
  }
}

// Initialize with storage or empty
function initGovernance() {
  proposals = loadProposalsFromStorage();
}

// Create a new proposal (local only for now)
function createProposal(data) {
  const id = data.id || `prop-${Date.now()}`;
  const now = new Date().toISOString();

  const proposal = {
    id,
    title: data.title || "Untitled proposal",
    description: data.description || "",
    chain: data.chain || "multi-chain",
    status: data.status || "active",
    createdAt: data.createdAt || now,
    snapshotId: data.snapshotId || null,
    metadataHash: data.metadataHash || null,
    tags: Array.isArray(data.tags) ? data.tags : []
  };

  proposals.push(proposal);
  saveProposalsToStorage();
  return proposal;
}

// Update proposal status
function updateProposalStatus(id, status) {
  const allowed = ["active", "passed", "rejected", "withdrawn"];
  if (!allowed.includes(status)) {
    console.warn("Invalid status:", status);
    return null;
  }

  const p = proposals.find((x) => x.id === id);
  if (!p) return null;

  p.status = status;
  saveProposalsToStorage();
  return p;
}

// Get all proposals
function getAllProposals() {
  return [...proposals].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

// Filter by status
function getProposalsByStatus(status) {
  return getAllProposals().filter((p) => p.status === status);
}

// Filter by chain
function getProposalsByChain(chain) {
  return getAllProposals().filter((p) => p.chain === chain);
}

// Filter by tag
function getProposalsByTag(tag) {
  return getAllProposals().filter((p) => p.tags.includes(tag));
}

// Render into a simple container (optional UI hook)
function renderProposals(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.warn("Governance container not found:", containerSelector);
    return;
  }

  const list = getAllProposals();

  if (list.length === 0) {
    container.innerHTML = `<p>No proposals registered yet.</p>`;
    return;
  }

  container.innerHTML = list
    .map((p) => {
      return `
        <div class="gov-proposal">
          <h3>${p.title}</h3>
          <p><strong>Status:</strong> ${p.status} • <strong>Chain:</strong> ${p.chain}</p>
          <p>${p.description || ""}</p>
          <p style="opacity:0.7;font-size:13px;">
            ID: ${p.id} • Snapshot: ${p.snapshotId || "none"} • Created: ${p.createdAt}
          </p>
        </div>
      `;
    })
    .join("");
}

// Auto‑init on load
document.addEventListener("DOMContentLoaded", () => {
  initGovernance();
});

// Expose API globally (optional)
window.CharmGovernance = {
  initGovernance,
  createProposal,
  updateProposalStatus,
  getAllProposals,
  getProposalsByStatus,
  getProposalsByChain,
  getProposalsByTag,
  renderProposals
};
