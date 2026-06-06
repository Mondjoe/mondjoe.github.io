/* -----------------------------------------------------------
   Charm Capsule — Identity Viewer
   File: capsule-info.js
   Purpose: Display capsule.json + chain metadata + validators
----------------------------------------------------------- */

const CAPSULE_INFO_CONFIG = {
  capsuleUrl: "capsule.json",
  manifestUrl: "metadata/governance/capsule-manifest.json",
  chainsDir: "metadata/chains/",
  validatorsDir: "metadata/validators/"
};

async function fetchJsonSafe(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function loadAllChains() {
  const chainNames = [
    "base",
    "ethereum",
    "solana",
    "ton",
    "tron",
    "bitcoin",
    "bsc"
  ];

  const results = {};
  for (const name of chainNames) {
    const data = await fetchJsonSafe(`${CAPSULE_INFO_CONFIG.chainsDir}${name}.json`);
    if (data) results[name] = data;
  }
  return results;
}

async function loadValidators(ids) {
  const results = {};
  for (const id of ids) {
    const data = await fetchJsonSafe(`${CAPSULE_INFO_CONFIG.validatorsDir}${id}.json`);
    if (data) results[id] = data;
  }
  return results;
}

function renderCapsuleInfoRoot(capsule, manifest, chains, validators) {
  const el = document.getElementById("capsule-info-container");
  if (!el) return;

  el.innerHTML = `
    <div class="snapshot-card">
      <h2>Capsule Identity</h2>
      <p><strong>Name:</strong> ${capsule.name}</p>
      <p><strong>Owner:</strong> ${capsule.owner}</p>
      <p><strong>Version:</strong> ${capsule.version}</p>
      <p><strong>Sovereignty:</strong></p>
      <pre class="mono">${JSON.stringify(capsule.sovereignty, null, 2)}</pre>
    </div>

    <div class="snapshot-card">
      <h2>Governance Capsule</h2>
      <p><strong>Module:</strong> ${manifest.module}</p>
      <p><strong>Version:</strong> ${manifest.version}</p>
      <p><strong>Rules:</strong></p>
      <pre class="mono">${JSON.stringify(manifest.rules, null, 2)}</pre>
    </div>

    <div class="snapshot-card">
      <h2>Chains</h2>
      ${Object.keys(chains)
        .map(
          (c) => `
        <div class="snapshot-card" style="margin-top:1rem;">
          <h3>${chains[c].chain}</h3>
          <div class="snapshot-meta">
            <div>Chain ID: ${chains[c].chain_id}</div>
            <div>Network: ${chains[c].network_type}</div>
            <div>Ecosystem: ${chains[c].ecosystem}</div>
            <div>RPC: ${chains[c].rpc.primary}</div>
            <div>Explorer: ${Object.values(chains[c].explorers)[0]}</div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>

    <div class="snapshot-card">
      <h2>Validators</h2>
      ${Object.keys(validators)
        .map(
          (id) => `
        <div class="snapshot-card" style="margin-top:1rem;">
          <h3>Validator ${id}</h3>
          <pre class="mono">${JSON.stringify(validators[id], null, 2)}</pre>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

window.loadCapsuleInfo = async function () {
  const container = document.getElementById("capsule-info-container");
  if (!container) return;

  container.innerHTML = `
    <div class="snapshot-card">
      <h2>Loading capsule identity…</h2>
      <p>Please wait.</p>
    </div>
  `;

  const capsule = await fetchJsonSafe(CAPSULE_INFO_CONFIG.capsuleUrl);
  const manifest = await fetchJsonSafe(CAPSULE_INFO_CONFIG.manifestUrl);

  if (!capsule || !manifest) {
    container.innerHTML = `
      <div class="error-box">
        Failed to load capsule identity.
      </div>
    `;
    return;
  }

  const chains = await loadAllChains();
  const validators = await loadValidators(capsule.validators || []);

  renderCapsuleInfoRoot(capsule, manifest, chains, validators);
};
