---
name: health-check
description: >-
  Weekly initiative health check: sync priorities.json with filesystem,
  approval queue, and artifact folders. Use for drift detection and link fixes.
---

# Health Check

Weekly pass across initiatives. Registry source: **`priorities.json`**. Approval queue: ideas with `lifecycle: "In Review"`.

## Steps

1. Read `priorities.json` — all initiatives, tiers, `lastWork`, projects, ideas.
2. **Approval queue:** For each idea with `lifecycle: "In Review"`, confirm artifact `**Status:** In Review` and `notes` align. Scan for `In Review` briefs missing `In Review` in priorities (fix priorities).
3. **Filesystem:** Under `initiatives/[Name]/projects/`, folder names must match `priorities.json` keys. Ideas with artifacts must have registry entries.
4. **Links:** Fix broken paths in `notes`, wiki, and artifacts after renames.
5. **Orphans:** FS idea folders without priorities entries → add via reconcile or manual registry row.
6. **Wiki:** Spot-check `wiki/index.md` and `log.md` if work touched wiki.
7. No standalone health report file — updates go to `priorities.json`, wiki, and chat summary.

## Definition of done

`priorities.json`, folders, and artifacts agree on names, lifecycle, and approval state.
