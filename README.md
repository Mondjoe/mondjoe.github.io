🌐 Charm Capsule — Validator Sovereignty Dashboard
Proof‑Driven Governance • Multi‑Chain Capsule Architecture

Charm Capsule is a modular, sovereign governance layer designed for validators, operators, and multi‑chain contributors who require verifiable control, transparent snapshots, and portable governance records across ecosystems.

This repository contains the public dashboard, snapshot registry, and capsule metadata that define the validator’s governance identity.

🧭 Purpose
Charm Capsule provides:

A sovereign validator identity anchored across chains

A public governance dashboard for transparency

A snapshot registry for proof‑driven decision flows

A capsule metadata layer for long‑term governance continuity

A multi‑page PWA that works offline, updates automatically, and installs as an app

This is the canonical source of truth for the validator’s governance footprint.

🗂️ Repository Structure
Code
Charm-validator-DB/
├── index.html
├── dashboard.html
├── about.html
├── settings.html
├── offline.html
├── sw.js
├── manifest.json
├── dashboard.js
├── router.js
├── Assets/
│   ├── og-image.png
│   ├── favicon-32.png
│   ├── favicon-192.png
│   ├── splash-1024.png
│   └── splash-2048.png
└── README.md
Key Components
index.html — Landing page + PWA entry

dashboard.html — Validator viewer, snapshots, governance

settings.html — Cache control, theme, PWA settings

offline.html — Offline fallback

sw.js — Multi‑page service worker (offline + updates)

router.js — Optional SPA navigation

dashboard.js — Future validator viewer engine

Assets/ — Icons, splash screens, branding

🔮 Sovereignty Principles
Charm Capsule is built on three core principles:

1. Proof Over Trust
Every governance action must be anchored in verifiable data — snapshots, signatures, or chain‑level proofs.

2. Portability Over Lock‑In
The capsule must survive migrations, forks, chain failures, and platform changes.

3. Transparency Over Ambiguity
All governance‑relevant information must be publicly accessible, timestamped, and immutable.

📦 Snapshot Registry
Snapshots define the validator’s governance state at specific points in time.

Each snapshot includes:

Chain

Height / Epoch

Validator state

Governance stance

Metadata hash

Timestamp

Snapshots are stored in /metadata/ or an external registry depending on chain requirements.

🛠️ PWA Architecture
Charm Capsule is a multi‑page PWA with:

Offline support

Auto‑update popup

Installable app mode

SPA‑style navigation (optional)

GitHub Pages compatibility

Core PWA Files
manifest.json — Identity, icons, splash screens

sw.js — Offline caching + update notifications

offline.html — Elegant offline fallback

🧩 Modules
Validator Viewer
Displays validator status, uptime, chain anchors, and metadata.

Snapshot Explorer
Shows historical governance snapshots.

Governance Capsule
Tracks proposals, votes, and decision flows.

Settings
Cache control, theme toggles, PWA preferences.

🚀 Roadmap
Multi‑chain validator ingestion

Snapshot anchoring

Governance capsule engine

Real‑time alerts

Exportable governance proofs

Capsule signing module

🖋️ Sovereign Signature
Code
╔══════════════════════════════════╗
║   Charm Capsule — Validator DB   ║
║   Proof‑Driven Governance Layer  ║
╚══════════════════════════════════╝
