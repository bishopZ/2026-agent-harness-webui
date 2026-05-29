---
name: remove-initiative
description: >-
  Remove an initiative from the repo. Archives or deletes the folder and
  removes its entry from priorities.json. Use when retiring a top-level area of focus.
---

# Remove Initiative

Remove an initiative from `priorities.json` and `initiatives/[Name]/`.

## Step 1 — Report

1. List active ideas in `priorities.json` for this initiative (`lifecycle` not Done/Dropped).
2. List projects under the initiative.
3. Note wiki depth beyond scaffold.

Stop and ask if active ideas exist (archive whole initiative vs clear projects first via **remove-project**).

## Step 2 — Execute

- **Archive:** `git mv initiatives/[Name]/` → `archive/[Name] - [YYYY-MM-DD]/` with README.
- **Delete:** remove folder when empty/resolved.

Remove the initiative key from `priorities.json`.

## Guardrails

Do not delete wiki pages; archive per `SYSTEM_OVERVIEW.md`. Do not edit `DASHBOARD.md` or `ideas.md`.
