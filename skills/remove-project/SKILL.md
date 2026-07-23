---
name: remove-project
description: >-
  Remove a named project from an initiative. Resolves ideas, archives folders,
  updates priorities.json and project-history.md. Use when retiring a project bucket.
---

# Remove Project

Remove a project from `priorities.json` and `initiatives/[Initiative]/projects/[Project]/`.

## Step 1 — Report

List ideas under the project in `priorities.json` and on disk. Stop if active ideas need user choice (archive, move to another project, or drop via **drop-idea**).

## Step 2 — Resolve ideas

For each idea: **drop-idea**, **complete-idea**, move to another project (update `priorities.json` keys and folder path), or archive.

## Step 3 — Remove project

1. Delete `projects/[Project Name]/` or archive it.
2. Remove project key from `priorities.json`.
3. Append row to `initiatives/[Initiative]/project-history.md` (**## Closed Projects** section).
4. Update `lastWork` if substantive.

Do not edit `ideas.md` or `DASHBOARD.md`.
