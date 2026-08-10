import type { CompetitorProfile, DiscoveryMode, DossierSectionId, RunStatus, StageId } from "./domain.js";

export interface ProductBriefSection {
  stageId: StageId | DossierSectionId;
  summary: string;
  findings: string[];
  decisions: string[];
  nextActions: string[];
  completedAt: string;
}

export interface ProductBriefModel {
  schemaVersion: 1;
  runId: string;
  title: string;
  mode: DiscoveryMode;
  status: RunStatus;
  ideaSummary: string;
  completedStages: StageId[];
  totalStages: number;
  nextAction: string;
  competitors: CompetitorProfile[];
  sections: ProductBriefSection[];
  updatedAt: string;
}

export function renderProductBrief(model: ProductBriefModel): string {
  const primaryCompetitors = model.competitors.filter(
    (competitor) => competitor.competitorType !== "behavioral"
  );
  const behavioralAlternatives = model.competitors.filter(
    (competitor) => competitor.competitorType === "behavioral"
  );
  const progress = Math.round(
    (model.completedStages.length / Math.max(1, model.totalStages)) * 100
  );
  const latest = model.sections.at(-1);
  const isActive = model.status === "running";
  const needsFounderDecisions =
    model.status === "failed" &&
    (model.nextAction.includes("outcome needs_changes") ||
      model.sections.some((section) => section.stageId === "product-readiness-review"));
  const statusLabel = needsFounderDecisions
    ? "needs Founder decisions"
    : model.status.replaceAll("_", " ");
  const decisionCount = model.sections.reduce((total, section) => total + section.decisions.length, 0);
  const actionCount = latest?.nextActions.length ?? 0;
  const metricCards: Array<readonly [string, string, string]> = [
    ["Progress", `${progress}%`, `${model.completedStages.length} of ${model.totalStages} stages`],
    ["Evidence", `${primaryCompetitors.length}`, "verified product competitors"],
    ["Decisions", `${decisionCount}`, "recorded in this brief"],
    ["Open actions", `${actionCount}`, needsFounderDecisions ? "required for readiness" : "from the latest stage"]
  ];
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(model.title)} — Product Brief</title>
<style>
:root{color-scheme:light;--bg:#f2f5f1;--surface:#fff;--surface-2:#f7faf7;--ink:#18201b;--muted:#68736b;--line:#dce3dc;--accent:#287a52;--accent-soft:#dfeee5;--inverse:#16271e;--inverse-ink:#fff;--danger:#b64a42;--shadow:0 12px 35px rgba(24,32,27,.07)}body[data-theme="earth"]{--bg:#f7f1e9;--surface:#fffdf9;--surface-2:#fbf5ee;--ink:#2c211b;--muted:#7c6c62;--line:#e6d8cb;--accent:#b85c36;--accent-soft:#f3dfd3;--inverse:#38231a;--inverse-ink:#fff9f4}body[data-theme="indigo"]{--bg:#f3f3f8;--surface:#fff;--surface-2:#f7f7fb;--ink:#20202a;--muted:#6d6c78;--line:#dedee9;--accent:#5551b8;--accent-soft:#e6e5f6;--inverse:#25234b;--inverse-ink:#fff}body[data-theme="midnight"]{color-scheme:dark;--bg:#101216;--surface:#1a1d23;--surface-2:#22262e;--ink:#f1f2f4;--muted:#9ca0aa;--line:#30343d;--accent:#7eb8ff;--accent-soft:#243650;--inverse:#e9eef7;--inverse-ink:#16181c;--shadow:0 12px 35px rgba(0,0,0,.22)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.layout{display:grid;grid-template-columns:220px minmax(0,1120px);gap:36px;max-width:1420px;margin:auto;padding:28px}.sidebar{position:sticky;top:28px;align-self:start;height:calc(100vh - 56px);padding:16px 4px}.brand{font-weight:800;font-size:18px;letter-spacing:-.02em;margin-bottom:26px}.brand span{color:var(--accent)}nav a{display:block;color:var(--muted);text-decoration:none;padding:8px 12px;border-radius:8px;margin:3px 0}nav a:hover{color:var(--accent);background:var(--accent-soft)}.themes{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:24px 8px}.themes button{appearance:none;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:99px;padding:7px 8px;font:11px inherit;cursor:pointer}.themes button[aria-pressed="true"]{background:var(--inverse);border-color:var(--inverse);color:var(--inverse-ink)}.run-meta{position:absolute;bottom:0;font-size:12px;color:var(--muted);overflow-wrap:anywhere}.shell{min-width:0;padding-bottom:80px}.hero{background:var(--inverse);color:var(--inverse-ink);border-radius:22px;padding:34px 38px;box-shadow:var(--shadow)}.hero-grid{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:start}.eyebrow,.label{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);font-weight:750}.hero .eyebrow,.hero p{color:color-mix(in srgb,var(--inverse-ink) 72%,transparent)}h1{font-size:44px;line-height:1.05;letter-spacing:-.04em;margin:8px 0 14px}.hero p{max-width:760px;margin:0}.status{min-width:190px;background:color-mix(in srgb,var(--inverse-ink) 10%,transparent);border:1px solid color-mix(in srgb,var(--inverse-ink) 18%,transparent);padding:15px 17px;border-radius:14px}.status strong{display:block;text-transform:capitalize}.status .muted{color:color-mix(in srgb,var(--inverse-ink) 70%,transparent)}.progress{height:7px;background:color-mix(in srgb,var(--inverse-ink) 16%,transparent);border-radius:99px;overflow:hidden;margin-top:12px}.progress span{display:block;height:100%;background:var(--accent);border-radius:99px}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:18px 0}.metric{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:17px 18px;box-shadow:var(--shadow)}.metric strong{display:block;font-size:28px;line-height:1.1;letter-spacing:-.03em;margin:4px 0}.metric small{color:var(--muted)}.grid{display:grid;grid-template-columns:1.3fr .7fr;gap:18px}.card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:24px;box-shadow:var(--shadow)}.card h2{margin:5px 0 15px;font-size:22px;line-height:1.3;letter-spacing:-.02em}.card h3{margin:14px 0 5px}.action{background:var(--inverse);color:var(--inverse-ink);border-color:var(--inverse)}.action .label,.action .muted,.action li{color:color-mix(in srgb,var(--inverse-ink) 78%,transparent)}.action.needs-decisions{background:var(--inverse);border-color:var(--inverse)}.working{margin-top:18px;border-left:4px solid var(--accent)}.pulse{display:inline-block;width:9px;height:9px;background:var(--accent);border-radius:50%;margin-right:8px;animation:pulse 1.5s infinite}@keyframes pulse{50%{opacity:.35}}ul{padding-left:20px;margin-bottom:0}li{margin:7px 0}.section{margin-top:18px}.section-head{display:flex;justify-content:space-between;align-items:end;gap:16px;margin-bottom:12px}.section-head h2{margin:0;font-size:25px}.competitors{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:14px}.competitor{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px;box-shadow:var(--shadow)}.competitor h3{font-size:18px;margin:8px 0}.competitor p{margin:8px 0}.tag{display:inline-block;font-size:11px;font-weight:750;text-transform:uppercase;letter-spacing:.06em;background:var(--accent-soft);color:var(--accent);border-radius:99px;padding:4px 9px}.pricing{background:var(--surface-2);border-radius:9px;padding:9px 11px}.audit{background:var(--surface)}details{border-top:1px solid var(--line);padding:15px 0}details:first-of-type{border-top:0}summary{cursor:pointer;font-weight:700;line-height:1.45}summary::marker{color:var(--accent)}.muted{color:var(--muted)}.footer{font-size:12px;margin-top:20px}@media(max-width:1000px){.layout{grid-template-columns:1fr}.sidebar{display:none}.metrics{grid-template-columns:repeat(2,1fr)}}@media(max-width:720px){.layout{padding:14px}.hero{padding:25px 22px}.hero-grid,.grid{grid-template-columns:1fr}h1{font-size:34px}.metrics{grid-template-columns:1fr 1fr}.status{min-width:0}.competitors{grid-template-columns:1fr}}@media(max-width:440px){.metrics{grid-template-columns:1fr}}
.executive-copy,.action-copy{font-size:17px;line-height:1.62;font-weight:400;letter-spacing:-.005em;margin:10px 0 18px;max-width:72ch}.action-copy{color:var(--inverse-ink)}.audit .section-head h2{font-weight:500}.audit summary{font-weight:400;color:var(--ink)}.audit details h3{font-weight:600}
</style></head><body data-theme="nature">
<div class="layout"><aside class="sidebar"><div class="brand">AI<span>·</span>EOS</div><nav><a href="#overview">Overview</a><a href="#metrics">Metrics</a><a href="#competition">Competition</a><a href="#evidence">Evidence trail</a></nav><div class="themes" aria-label="Color theme"><button data-theme="nature" aria-pressed="true">Nature</button><button data-theme="earth" aria-pressed="false">Earth</button><button data-theme="indigo" aria-pressed="false">Indigo</button><button data-theme="midnight" aria-pressed="false">Midnight</button></div><div class="run-meta">${escapeHtml(model.mode)} mode<br>${escapeHtml(model.runId)}</div></aside><main class="shell">
<header class="hero" id="overview"><div class="hero-grid"><div><div class="eyebrow">Living Product Brief · ${escapeHtml(model.mode)} mode</div><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.ideaSummary)}</p></div><div class="status"><strong>${escapeHtml(statusLabel)}</strong><div class="muted">${model.completedStages.length} of ${model.totalStages} stages</div><div class="progress"><span style="width:${progress}%"></span></div></div></div></header>
<section class="metrics" id="metrics">${metricCards.map(([label, value, detail]) => `<article class="metric"><div class="label">${escapeHtml(label)}</div><strong>${escapeHtml(value)}</strong><small>${escapeHtml(detail)}</small></article>`).join("")}</section>
<div class="grid"><section class="card"><div class="label">Executive finding</div><p class="executive-copy">${escapeHtml(latest?.summary ?? "Discovery is starting")}</p>${list((latest?.findings ?? []).slice(0, 5))}</section><aside class="card action${needsFounderDecisions ? " needs-decisions" : ""}"><div class="label">${needsFounderDecisions ? "Founder decisions required" : "Next Founder action"}</div><p class="action-copy">${escapeHtml(model.nextAction)}</p>${list(latest?.nextActions ?? [])}</aside></div>
${isActive ? `<section class="card working" aria-live="polite"><div class="label"><span class="pulse"></span>Working now</div><h2>${escapeHtml(model.nextAction)}</h2><p class="muted">Active for <span id="elapsed">0 seconds</span>. Persisted progress appears automatically.</p></section>` : ""}
<section class="section" id="competition"><div class="section-head"><div><div class="label">Market evidence</div><h2>Competitor landscape</h2></div><span class="muted">${primaryCompetitors.length ? `${primaryCompetitors.length} verified profiles` : "Research pending"}</span></div><div class="competitors">${primaryCompetitors.map(renderCompetitor).join("") || '<article class="competitor muted">Verified product competitor profiles will appear here during market research.</article>'}</div></section>
${behavioralAlternatives.length ? `<section class="section" id="alternatives"><div class="section-head"><div><div class="label">Customer behavior</div><h2>Behavioral alternatives</h2></div><span class="muted">Not product competitors</span></div><p class="muted">These options compete for the customer’s time, attention, or budget. They are tracked separately and do not count as competitors.</p><div class="competitors">${behavioralAlternatives.map(renderCompetitor).join("")}</div></section>` : ""}
<section class="card section audit" id="evidence"><div class="section-head"><div><div class="label">Traceability</div><h2>Decisions and evidence</h2></div><span class="muted">${model.sections.length} completed sections</span></div>${model.sections.map(renderSection).join("") || '<p class="muted">Stage evidence will appear here as it is persisted.</p>'}</section>
<p class="muted footer">Updated ${escapeHtml(model.updatedAt)}${isActive ? " · Live preview enabled" : ""}.</p>
</main></div><script>
const themeKey="ai-eos-product-brief-theme";
const themeButtons=[...document.querySelectorAll("button[data-theme]")];
function setTheme(theme){document.body.dataset.theme=theme;themeButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.theme===theme)));try{localStorage.setItem(themeKey,theme)}catch{}}
themeButtons.forEach(button=>button.addEventListener("click",()=>setTheme(button.dataset.theme)));
try{setTheme(localStorage.getItem(themeKey)||"nature")}catch{setTheme("nature")}
${isActive ? `
const updatedAt = Date.parse(${JSON.stringify(model.updatedAt)});
const elapsed = document.getElementById("elapsed");
function updateElapsed(){const seconds=Math.max(0,Math.round((Date.now()-updatedAt)/1000));elapsed.textContent=seconds+" second"+(seconds===1?"":"s")}
updateElapsed();setInterval(updateElapsed,1000);setTimeout(()=>location.reload(),3000);
` : ""}</script></body></html>`;
}

function renderCompetitor(item: CompetitorProfile): string {
  return `<article class="competitor"><span class="tag">${escapeHtml(item.competitorType)}</span><h3>${escapeHtml(item.name)}</h3>${item.location ? `<p class="muted">${escapeHtml(item.location)}</p>` : ""}<p>${escapeHtml(item.coreOffer)}</p>${item.relevanceReason ? `<p><strong>Why it is relevant</strong><br>${escapeHtml(item.relevanceReason)}</p>` : ""}<p class="pricing"><strong>Pricing</strong><br>${escapeHtml(item.pricingStatus)}</p>${item.strengths.length ? `<p><strong>Strengths</strong><br>${escapeHtml(item.strengths.join(" · "))}</p>` : ""}${item.unknowns.length ? `<p class="muted"><strong>Still unknown</strong><br>${escapeHtml(item.unknowns.join(" · "))}</p>` : ""}</article>`;
}

function renderSection(section: ProductBriefSection): string {
  return `<details><summary>${escapeHtml(section.stageId)} — ${escapeHtml(section.summary)}</summary><h3>Findings</h3>${list(section.findings)}<h3>Decisions</h3>${list(section.decisions)}<h3>Next actions</h3>${list(section.nextActions)}</details>`;
}

function list(items: string[]): string {
  return items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : '<p class="muted">None recorded yet.</p>';
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
