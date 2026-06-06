/* -----------------------------------------------------------
   Charm Capsule — Minimal SPA Router
   File: router.js
   Purpose: Hash-based routing for snapshots, governance, and dashboard
----------------------------------------------------------- */

(function () {
  const routes = {
    '': renderHome,
    '#/': renderHome,
    '#/snapshots': renderSnapshotList,
    '#/snapshot': renderSnapshotView,        // expects ?id=XXXX
    '#/governance': renderGovernance,
    '#/capsule': renderCapsuleInfo
  };

  function parseHash() {
    const hash = window.location.hash || '#/';
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');
    return { path, params };
  }

  function navigate(path) {
    window.location.hash = path;
  }

  function onRouteChange() {
    const { path, params } = parseHash();
    const route = routes[path] || renderNotFound;
    route(params);
  }

  // --------- DOM helpers ---------

  function getRoot() {
    return document.getElementById('app') || document.body;
  }

  function setTitle(title) {
    document.title = `Charm Capsule — ${title}`;
  }

  function render(html) {
    getRoot().innerHTML = html;
  }

  // --------- Route handlers ---------

  function renderHome() {
    setTitle('Dashboard');
    render(`
      <div class="snapshot-list">
        <h1>Charm Capsule</h1>
        <p>Unified sovereign dashboard.</p>
        <div class="snapshot-actions">
          <button class="snapshot-btn" onclick="router.navigate('#/snapshots')">
            View Snapshots
          </button>
          <button class="snapshot-btn" onclick="router.navigate('#/governance')">
            Governance
          </button>
          <button class="snapshot-btn" onclick="router.navigate('#/capsule')">
            Capsule Identity
          </button>
        </div>
      </div>
    `);
  }

  function renderSnapshotList() {
    setTitle('Snapshots');
    // Assumes snapshot-list.html or inline rendering via JS elsewhere
    render(`
      <div class="snapshot-list">
        <h1>Snapshots</h1>
        <p>Select a snapshot to view its anchored state.</p>
        <div id="snapshot-list-container"></div>
      </div>
    `);
    if (window.loadSnapshotList) window.loadSnapshotList();
  }

  function renderSnapshotView(params) {
    const id = params.get('id');
    setTitle(id ? `Snapshot ${id}` : 'Snapshot');
    render(`
      <div class="snapshot-list">
        <h1>Snapshot ${id || ''}</h1>
        <div id="snapshot-viewer-container"></div>
      </div>
    `);
    if (window.loadSnapshotViewer) window.loadSnapshotViewer(id);
  }

  function renderGovernance() {
    setTitle('Governance');
    render(`
      <div class="snapshot-list">
        <h1>Governance</h1>
        <div id="governance-container"></div>
      </div>
    `);
    if (window.loadGovernance) window.loadGovernance();
  }

  function renderCapsuleInfo() {
    setTitle('Capsule Identity');
    render(`
      <div class="snapshot-list">
        <h1>Capsule Identity</h1>
        <div id="capsule-info-container"></div>
      </div>
    `);
    if (window.loadCapsuleInfo) window.loadCapsuleInfo();
  }

  function renderNotFound() {
    setTitle('Not Found');
    render(`
      <div class="snapshot-list">
        <h1>404</h1>
        <p>Route not found.</p>
        <button class="snapshot-btn" onclick="router.navigate('#/')">
          Back to Dashboard
        </button>
      </div>
    `);
  }

  // --------- Init ---------

  window.addEventListener('hashchange', onRouteChange);
  window.addEventListener('load', onRouteChange);

  // Expose minimal API
  window.router = {
    navigate
  };
})();
