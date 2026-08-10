import type { CompetitorProfile, DiscoveryMode, RunStatus, StageId } from "./domain.js";

export interface ProductBriefSection {
  stageId: StageId;
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
  const progress = Math.round(
    (model.completedStages.length / Math.max(1, model.totalStages)) * 100
  );
  const latest = model.sections.at(-1);
  const isActive = model.status === "running";
  const statusLabel = model.status === "failed" && model.nextAction.includes("outcome needs_changes")
    ? "needs Founder decisions"
    : model.status.replaceAll("_", " ");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(model.title)} — Product Brief</title>
<style>
:root{color-scheme:light dark;--bg:#f6f3ec;--card:#fffdf8;--ink:#20201d;--muted:#68675f;--line:#d9d4c8;--accent:#315d54;--warn:#9c4a24}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,sans-serif}.shell{max-width:1080px;margin:auto;padding:32px 22px 80px}header{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:start}.eyebrow,.label{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}h1{font-size:42px;line-height:1.05;margin:8px 0}.status{border:1px solid var(--line);background:var(--card);padding:14px 18px;border-radius:12px}.progress{height:8px;background:var(--line);border-radius:9px;overflow:hidden;margin-top:10px}.progress span{display:block;height:100%;background:var(--accent)}.grid{display:grid;grid-template-columns:1.25fr .75fr;gap:18px;margin-top:24px}.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px}.card h2{margin:4px 0 14px;font-size:22px}.action{border-left:5px solid var(--warn)}ul{padding-left:20px}li{margin:7px 0}.competitors{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}.competitor{border:1px solid var(--line);border-radius:10px;padding:15px}.competitor h3{margin:4px 0}.tag{display:inline-block;font-size:12px;background:#dfeae6;color:#24483f;border-radius:99px;padding:3px 9px}details{border-top:1px solid var(--line);padding:14px 0}summary{cursor:pointer;font-weight:650}.muted{color:var(--muted)}@media(max-width:720px){header,.grid{grid-template-columns:1fr}h1{font-size:32px}}
</style></head><body><main class="shell">
<header><div><div class="eyebrow">AI-EOS · Living Product Brief · ${escapeHtml(model.mode)} mode</div><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.ideaSummary)}</p></div><div class="status"><strong>${escapeHtml(statusLabel)}</strong><div class="muted">${model.completedStages.length} of ${model.totalStages} stages</div><div class="progress"><span style="width:${progress}%"></span></div></div></header>
<div class="grid"><section class="card"><div class="label">Latest confirmed learning</div><h2>${escapeHtml(latest?.summary ?? "Discovery is starting")}</h2>${list(latest?.findings ?? [])}</section><aside class="card action"><div class="label">Next Founder action</div><h2>${escapeHtml(model.nextAction)}</h2>${list(latest?.nextActions ?? [])}</aside></div>
${isActive ? `<section class="card" style="margin-top:18px" aria-live="polite"><div class="label">Working now</div><h2>${escapeHtml(model.nextAction)}</h2><p class="muted">Active for <span id="elapsed">0 seconds</span>. This preview refreshes automatically when persisted progress changes.</p></section>` : ""}
<section class="card" style="margin-top:18px"><div class="label">Competitor landscape</div><h2>${model.competitors.length ? `${model.competitors.length} verified profiles` : "Research pending"}</h2><div class="competitors">${model.competitors.map(renderCompetitor).join("")}</div></section>
<section class="card" style="margin-top:18px"><div class="label">Decisions and audit trail</div>${model.sections.map(renderSection).join("") || '<p class="muted">Stage evidence will appear here as it is persisted.</p>'}</section>
<p class="muted">Run ${escapeHtml(model.runId)} · Updated ${escapeHtml(model.updatedAt)}${isActive ? " · Live preview enabled" : ""}.</p>
</main>${isActive ? `<script>
const updatedAt = Date.parse(${JSON.stringify(model.updatedAt)});
const elapsed = document.getElementById("elapsed");
function updateElapsed(){const seconds=Math.max(0,Math.round((Date.now()-updatedAt)/1000));elapsed.textContent=seconds+" second"+(seconds===1?"":"s")}
updateElapsed();setInterval(updateElapsed,1000);setTimeout(()=>location.reload(),3000);
</script>` : ""}</body></html>`;
}

function renderCompetitor(item: CompetitorProfile): string {
  return `<article class="competitor"><span class="tag">${escapeHtml(item.competitorType)}</span><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.coreOffer)}</p><p><strong>Pricing:</strong> ${escapeHtml(item.pricingStatus)}</p>${item.unknowns.length ? `<p class="muted">Unknown: ${escapeHtml(item.unknowns.join("; "))}</p>` : ""}</article>`;
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
