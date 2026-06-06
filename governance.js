/* -----------------------------------------------------------
   Charm Capsule — Governance Engine
   File: governance.js
   Purpose: Load proposals, templates, and render governance UI
----------------------------------------------------------- */

(function () {
  const GOVERNANCE_CONFIG = {
    proposalsUrl: 'metadata/governance/proposals.json',
    templatesUrl: 'metadata/governance/proposal-templates.json',
    capsuleManifestUrl: 'metadata/governance/capsule-manifest.json'
  };

  let state = {
    proposals: [],
    templates: [],
    manifest: null,
    filter: 'all'
  };

  // --------- Fetch helpers ---------

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return res.json();
  }

  async function loadGovernanceData() {
    const [proposals, templates, manifest] = await Promise.all([
      fetchJson(GOVERNANCE_CONFIG.proposalsUrl),
      fetchJson(GOVERNANCE_CONFIG.templatesUrl),
      fetchJson(GOVERNANCE_CONFIG.capsuleManifestUrl)
    ]);
    state.proposals = proposals;
    state.templates = templates;
    state.manifest = manifest;
  }

  // --------- Rendering ---------

  function renderGovernanceRoot() {
    const el = document.getElementById('governance-container');
    if (!el) return;

    el.innerHTML = `
      <div class="snapshot-card">
        <h2>Governance Capsule</h2>
        <p>${state.manifest?.capsule || 'Charm Capsule'} — ${state.manifest?.module || 'Governance'} v${state.manifest?.version || '1.0.0'}</p>
      </div>

      <div class="snapshot-card">
        <h2>Proposals</h2>
        <div class="snapshot-actions">
          <button class="snapshot-btn" data-filter="all">All</button>
          <button class="snapshot-btn" data-filter="active">Active</button>
          <button class="snapshot-btn" data-filter="passed">Passed</button>
          <button class="snapshot-btn" data-filter="rejected">Rejected</button>
        </div>
        <div id="proposal-list"></div>
      </div>

      <div class="snapshot-card">
        <h2>Templates</h2>
        <div id="template-list"></div>
      </div>
    `;

    attachFilterHandlers();
    renderProposalList();
    renderTemplateList();
  }

  function attachFilterHandlers() {
    const el = document.getElementById('governance-container');
    el.querySelectorAll('.snapshot-btn[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.filter = btn.getAttribute('data-filter');
        renderProposalList();
      });
    });
  }

  function renderProposalList() {
    const listEl = document.getElementById('proposal-list');
    if (!listEl) return;

    const proposals = state.proposals.filter(p => {
      if (state.filter === 'all') return true;
      return p.status === state.filter;
    });

    if (!proposals.length) {
      listEl.innerHTML = `<p>No proposals found for filter: <strong>${state.filter}</strong>.</p>`;
      return;
    }

    listEl.innerHTML = proposals
      .map(p => {
        const snapshotLabel = p.snapshot ? `Snapshot: ${p.snapshot}` : 'Snapshot: pending';
        const hashLabel = p.metadata_hash || 'No metadata hash';
        return `
          <div class="snapshot-card">
            <h2>${p.title}</h2>
            <div class="snapshot-meta">
              <div>ID: ${p.id}</div>
              <div>Chain: ${p.chain}</div>
              <div>Status: ${p.status}</div>
              <div>${snapshotLabel}</div>
              <div>Metadata hash: ${hashLabel}</div>
              <div>Created: ${p.created_at}</div>
              <div>Tags: ${(p.tags || []).join(', ')}</div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function renderTemplateList() {
    const listEl = document.getElementById('template-list');
    if (!listEl) return;

    if (!state.templates.length) {
      listEl.innerHTML = `<p>No templates defined.</p>`;
      return;
    }

    listEl.innerHTML = state.templates
      .map(t => {
        return `
          <div class="snapshot-card">
            <h2>${t.title}</h2>
            <div class="snapshot-meta">
              <div>Template ID: ${t.template_id}</div>
              <div>Description: ${t.description}</div>
              <div>Default chain: ${t.default_chain}</div>
              <div>Required fields: ${(t.required_fields || []).join(', ')}</div>
              <div>Tags: ${(t.tags || []).join(', ')}</div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  // --------- Public entrypoint ---------

  window.loadGovernance = async function () {
    const container = document.getElementById('governance-container');
    if (!container) return;

    container.innerHTML = `
      <div class="snapshot-card">
        <h2>Loading governance data…</h2>
        <p>Please wait.</p>
      </div>
    `;

    try {
      await loadGovernanceData();
      renderGovernanceRoot();
    } catch (err) {
      container.innerHTML = `
        <div class="error-box">
          <strong>Failed to load governance data.</strong><br>
          ${err.message}
        </div>
      `;
    }
  };
})();
