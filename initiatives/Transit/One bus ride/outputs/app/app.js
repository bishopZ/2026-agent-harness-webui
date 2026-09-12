// One Bus Ride — itinerary engine
// Loads stops.json, computes a board/alight plan from (direction, start, budget),
// renders it, and keeps the current selection in the URL so plans are shareable.
// See 04_design.md and 05_build_plan.md Task 2/3 for the design and acceptance criteria this implements.

const BUDGET_OFFSETS = { short: 1, medium: 3, long: 5 };

let STOPS = null;

async function loadStops() {
  const res = await fetch("stops.json", { cache: "no-store" });
  const data = await res.json();
  STOPS = data;
  return data;
}

/**
 * Compute the alight stop index for a given start index, direction, and budget,
 * clamped to the corridor's bounds (AC-01: always produces a valid, in-bounds result).
 */
function computeAlightIndex(startIndex, direction, budget, stopCount) {
  const offset = BUDGET_OFFSETS[budget] ?? BUDGET_OFFSETS.medium;
  const step = direction === "southbound" ? 1 : -1;
  const raw = startIndex + step * offset;
  return Math.max(0, Math.min(stopCount - 1, raw));
}

function buildPlan(direction, startId, budget, stopsOverride) {
  const stops = stopsOverride || STOPS.stops;
  const startIndex = stops.findIndex((s) => s.id === startId);
  const safeStartIndex = startIndex === -1 ? 0 : startIndex;
  const alightIndex = computeAlightIndex(safeStartIndex, direction, budget, stops.length);
  return {
    direction,
    budget,
    board: stops[safeStartIndex],
    alight: stops[alightIndex],
    sameStop: alightIndex === safeStartIndex,
  };
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPlanInputs() {
  const directions = ["southbound", "northbound"];
  const budgets = Object.keys(BUDGET_OFFSETS);
  const direction = pickRandom(directions);
  const start = pickRandom(STOPS.stops).id;
  const budget = pickRandom(budgets);
  return { direction, start, budget };
}

function directionLabel(direction) {
  return direction === "southbound"
    ? "Southbound (North Lamar → downtown → South Congress)"
    : "Northbound (South Congress → downtown → North Lamar)";
}

function renderPlan(plan) {
  const el = document.getElementById("itinerary");
  const poisHtml = plan.alight.pois
    .map(
      (p) => `
      <li>
        <strong>${escapeHtml(p.name)}</strong> <span class="poi-cat">(${escapeHtml(p.category)}, ~${p.walkMinutes} min walk)</span>
        <p>${escapeHtml(p.description)}</p>
      </li>`
    )
    .join("");

  const sameStopNote = plan.sameStop
    ? `<p class="note">Your time budget keeps you at the same stop you boarded — try a longer budget for a farther stop.</p>`
    : "";

  el.innerHTML = `
    <h2>Your one bus ride</h2>
    <p class="direction">${escapeHtml(directionLabel(plan.direction))}</p>
    <p><strong>Board:</strong> ${escapeHtml(plan.board.name)}</p>
    <p><strong>Alight:</strong> ${escapeHtml(plan.alight.name)}</p>
    ${sameStopNote}
    <h3>Things to do near ${escapeHtml(plan.alight.name)}</h3>
    <ul class="poi-list">${poisHtml}</ul>
    <p class="return-note">When you're done, catch the 801 back the way you came, or continue in the same direction to keep exploring.</p>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function readParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    direction: params.get("dir") || "southbound",
    start: params.get("start") || "crestview",
    budget: params.get("budget") || "medium",
  };
}

function writeParams({ direction, start, budget }) {
  const params = new URLSearchParams();
  params.set("dir", direction);
  params.set("start", start);
  params.set("budget", budget);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
}

function currentSelection() {
  return {
    direction: document.getElementById("direction").value,
    start: document.getElementById("start").value,
    budget: document.getElementById("budget").value,
  };
}

function applySelectionToForm({ direction, start, budget }) {
  document.getElementById("direction").value = direction;
  document.getElementById("start").value = start;
  document.getElementById("budget").value = budget;
}

function populateStartOptions() {
  const select = document.getElementById("start");
  select.innerHTML = STOPS.stops
    .map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`)
    .join("");
}

function generateAndRender(selection) {
  const plan = buildPlan(selection.direction, selection.start, selection.budget);
  renderPlan(plan);
  writeParams(selection);
}

async function init() {
  await loadStops();
  populateStartOptions();

  const initial = readParams();
  applySelectionToForm(initial);
  generateAndRender(initial);

  document.getElementById("plan-form").addEventListener("submit", (e) => {
    e.preventDefault();
    generateAndRender(currentSelection());
  });

  document.getElementById("surprise-me").addEventListener("click", () => {
    const random = randomPlanInputs();
    applySelectionToForm(random);
    generateAndRender(random);
  });
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}


// Exposed for the Task 2 verification sweep (05_build/verification_log.md) and
// any future automated tests. Has no effect in the browser, where `module` is undefined.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { computeAlightIndex, buildPlan, BUDGET_OFFSETS };
}
