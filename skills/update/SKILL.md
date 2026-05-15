---
name: update
description: >-
  Ingest source documents into an initiative wiki: discover newest sources
  first, read and synthesize, create or update wiki pages, move staging files,
  and refresh index.md and log.md. Use when the user wants wiki ingest, raw
  folder processing, sources pulled into the knowledge base, or says to run the
  update skill for wiki sources.
---

# Wiki source ingest (update skill)

Run a full **ingest** pass for one initiative. Follow [SYSTEM_OVERVIEW.md](../../SYSTEM_OVERVIEW.md) for wiki operations, domain layout, and folder rules.

This skill is **not** the same as the wiki **Update** operation in SYSTEM_OVERVIEW (capturing conversation/decisions without a new source file). This skill is **ingest from files**.

Do not use Trello. Use only files in this repo.

## When to use

The user asks to ingest sources, process `/raw/`, pull documents into a wiki, sync new files into `sources/`, refresh the knowledge base from files, or **run the update skill** for wiki source ingest.

## Core principle: newest sources win

1. **Discover and order sources by recency before reading deeply.** Prefer modification time (newest first). Use the repo as ground truth.
2. **Synthesis must reflect the latest material.** When a newer source disagrees with an older wiki page or an older source, update the wiki to match the newer evidence. Note the change in `log.md` and, when helpful, add a short "Supersedes" or dated note on the page body.
3. **If the user names specific files, still sort those by mtime and process newest first** unless they explicitly forbid reordering.

### How to find candidates (do this first)

For the chosen initiative root `initiatives/[Initiative Name]/`:

1. **Staging:** List non-hidden files under repo `/raw/` (if any are meant for this initiative, the user usually says so; otherwise only ingest into an initiative when the user ties the file to that initiative).
2. **Initiative-wide:** `initiatives/[Initiative]/sources/` (any file type the agent can read).
3. **Project-scoped:** `initiatives/[Initiative]/projects/*/sources/`.

Use a shell discovery pass so ordering is objective, for example:

```bash
# Newest first under initiative sources trees (adjust initiative path)
find "/path/to/initiatives/[Initiative Name]" \( -path "*/sources/*" -o -path "*/projects/*/sources/*" \) -type f ! -name ".DS_Store" -print0 | xargs -0 ls -t
```

Also check `/raw/`:

```bash
find "/path/to/repo/raw" -type f ! -name ".DS_Store" -print0 2>/dev/null | xargs -0 ls -t
```

If `find` is noisy, filter to extensions you can ingest (`.md`, `.txt`, `.csv`, `.pdf`, `.docx`, and similar). **Do not skip a newer file just because it is binary.** Use whatever tools are available to extract text (for example `textutil` on macOS for some formats, or dedicated extraction). If text cannot be extracted, log the failure in chat and in `wiki/log.md` under a dated ingest entry as deferred.

## Before writing wiki content

1. **Confirm the initiative.** The folder must exist under `initiatives/`. If ambiguous, ask once.
2. **Read `initiatives/[Initiative]/wiki/index.md` in full.** This is the architecture map. Decide which domains and pages the new material belongs in. Plan updates to the domain tables, cross-reference index, open questions, and footer "Last updated" line.
3. **Open any wiki pages you will change.** Merge new facts into the right sections instead of duplicating whole pages.
4. **Choose destination for the file after ingest.**
   - From **`/raw/`**, after processing, **move** (not copy) into `initiatives/[Initiative]/sources/` **or** into `initiatives/[Initiative]/projects/[Project]/sources/` when the document clearly belongs to one project only.
   - Files already under an initiative or project `sources/` folder **stay put**. They are immutable. **Never edit files under any `sources/` directory.**

## Domain placement

Map content to domains using the tables in [SYSTEM_OVERVIEW.md](../../SYSTEM_OVERVIEW.md) (business vs personal brand vs creative). Create new pages only when the topic deserves a durable home. One source may update several pages across domains.

Use lowercase hyphenated filenames for new pages. **Never delete wiki pages.** Retire outdated pages by moving them to `wiki/.archive/` with a short reason.

## Page quality (match repo standards)

When creating or substantially updating pages, align with SYSTEM_OVERVIEW **Wiki Document Standards**:

- YAML front matter where the rest of the wiki uses it (`domain`, `type`, `tags`, `related_documents`, `status`, `version`, `created`, `modified` as appropriate).
- A clear purpose or "when to load this" callout if that is the local pattern.
- **Open Questions** and **See also** cross-links when the rest of the wiki does.
- Separate **validated** vs **working assumptions** when claims drive decisions.
- Link back to originating sources (paths relative to the wiki file or initiative root, consistent with existing pages).

If the initiative’s existing pages use a lighter header style (for example bold field lines instead of YAML only), **match the initiative’s existing wiki style** for that file.

## Bookkeeping (required on every ingest)

1. **`wiki/log.md`.** Append a dated block at the top of the chronological section (after the format instructions if present). Use:

   `## [YYYY-MM-DD] ingest | short description`

   List which sources were ingested (paths), which wiki pages were created or updated, and anything deferred (unreadable files, unclear ownership).

2. **`wiki/index.md`.** Update domain tables (summary, type, status), cross-reference index, open questions, and the footer last-updated line.

3. **Chat.** Short summary for the user: what was newest, what changed in the wiki, where files landed, and what is still open.

## Contradictions and scope

- If two sources at the same "freshness" disagree, do not hide it. Record both in the wiki or in Open Questions until resolved.
- If material really belongs to a **different** initiative, say so in chat and do not file it in the wrong wiki without user confirmation.

## Definition of done

1. Newest-first discovery was performed and documented in the log entry (which sources counted as "this pass").
2. Every processed source either moved from `/raw/` to the correct `sources/` tree or was already in `sources/` and was read without modification.
3. Wiki pages and `index.md` reflect the new content. Stale claims superseded by newer sources were updated or flagged.
4. `log.md` contains a matching `ingest` entry for this session.
5. No edits were made inside any `sources/` file content.

## References

- [SYSTEM_OVERVIEW.md](../../SYSTEM_OVERVIEW.md). Four wiki operations, domain lists, `/raw/` and `sources/` rules, naming, log format.
- [`skills/health-check/SKILL.md`](../health-check/SKILL.md). Optional alignment with tracker and initiative hygiene after large ingests (not a substitute for ingest bookkeeping).
