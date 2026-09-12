# Slice 1 — Data model and stops.json

**Task:** Task 1 in `05_build_plan.md`.

## What changed

Added `outputs/app/stops.json`: six MetroRapid 801 stops in north-to-south order (Crestview, North Loop, UT West Mall, Capitol, Bouldin, South Congress), each with one or two points of interest (`name`, `category`, `walkMinutes`, `description`), plus a top-level `lastVerified` date field per **ADR-transit-20260911-02** (content lives separately from app code).

## Why

This is the foundation every later slice reads from. Getting the schema right here (durable landmarks favored over specific businesses, per the staleness mitigation in `04_design.md`) avoids rework in Slices 2–4.
