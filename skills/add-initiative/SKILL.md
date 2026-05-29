---
name: add-initiative
description: >-
  Add a new initiative to the repo. Creates the initiative folder structure,
  registers it in priorities.json with a General project, and initializes the wiki.
---

# Add Initiative

Creates a new top-level initiative. Register in **`priorities.json`**; do **not** create `ideas.md`.

## Inputs

- **Initiative name** — folder name and `priorities.json` key.
- **Type** — `business`, `personal brand`, or `creative project` (wiki domains).
- **Description** — stored as General project `purpose` and wiki context.
- **Tier points** — integer in `priorities.json`; fit the existing stack.

## Folder structure

```
initiatives/[Initiative Name]/
  sources/         (.gitkeep)
  outputs/         (.gitkeep)
  projects/
    General/       (.gitkeep)
  wiki/
    index.md
    log.md
```

## priorities.json entry

Add under `initiatives`:

```json
"[Initiative Name]": {
  "tier": 5,
  "lastWork": "YYYY-MM-DD",
  "projects": {
    "General": {
      "priority": "Medium",
      "purpose": "[Description]",
      "ideas": {}
    }
  }
}
```

## Wiki files

- `wiki/index.md` — domains per `SYSTEM_OVERVIEW.md` for the initiative type.
- `wiki/log.md` — init entry for today.

## Completion summary

- Name, type, tier.
- Folders and registry entry created.
- Use **add-project** / **add-idea** to populate.
