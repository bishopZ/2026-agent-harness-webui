# Execution Environment and Capabilities

**Know what you can and cannot run before you decide an idea is blocked.** Most "I can't do this" moments are really "I can't do *part* of this here." An agent that does not know its own environment fills the gap with a guess, and a guessed blocker — stated only in chat, written nowhere — silently stops work that was actually ready. This rule replaces the guess with a documented fact and a mandatory hand-off protocol.

## Why this rule exists

A next-idea run once selected the top Build idea, decided its slice "required a Mac / cameras / Xcode," skipped it, and quietly did an easier idea instead. The slice was marked `Ready`. The blocker was never written into any repo file. Both moves were wrong: the environment boundary was undocumented, so the agent invented one, and the code that *could* have been written was not. This rule exists so that never repeats.

## The environment, stated plainly

The agent's shell runs on **Linux (aarch64)**, not on the owner's Mac. It is a real, capable environment for a lot of work, and a hard wall for the rest.

**Available in the shell:**

- Node.js and npm/npx — TypeScript, React, Vite, Jest/Vitest, ESLint, web builds, `tsc --noEmit`.
- Python 3 with `pip`.
- `git` (local operations), and standard CLI tooling (`rsync`, `grep`, `find`, `curl` subject to network policy).
- Read/write access to the harness files and each project's `repo/` working tree.

**NOT available in the shell (owner-side only):**

- **Apple toolchain** — no `swift`, `swiftc`, `xcodebuild`, `xcrun`, `metal`, no Xcode. macOS/Metal/AVFoundation apps cannot be compiled or run here.
- **iOS** — no simulator or device; Expo/React Native apps cannot be launched, and mic/torch/camera behaviour cannot be exercised.
- **Apple-silicon runtimes** — no MLX, no CoreML, no GPU; MLX/Metal inference cannot be executed or benchmarked.
- **Hardware** — no cameras, microphones, or displays.
- **A browser for visual smoke** — no rendered-page inspection; "does it look right at 1280px" is an owner check.
- **A shell on the Mac** — the file tools *write* to the owner's Mac, but there is no interactive shell there. Reachable only through explicit desktop-control tooling, which is not part of an unattended run.

If in doubt about a capability, **test it** (`command -v swift`, `uname -a`) and record the result, rather than asserting.

## The split-execution mandate

When a slice needs a capability the shell lacks, the idea is **not** blocked and is **not** to be skipped. Split the work:

1. **Author everything authorable in `repo/`.** Write the actual source, config, and files the slice calls for. Untested-because-unbuildable is fine and expected; unwritten is not.
2. **Verify what you can here.** Run the parts the shell supports (`tsc`, unit/logic tests, greps, JSON validation) and record the results in `05_build/verification_log.md`.
3. **Hand the rest to the owner in the checkpoint.** Write the exact owner steps — commands to run, tools to install, permissions to grant, what to capture — into the checkpoint section of `05_build_plan.md`. Not into chat. Not into a side report. Into the checkpoint the owner will actually open.
4. **Set the idea `In Review`** with `checkpoint.status: "In Review"` and a `reason` naming the exact next owner action (see `docs/priorities-registry.md`).

A blocker that is not written into a repo file does not exist. If you could not even author the slice, say so in chat and stop — but that is rare, and it is never satisfied by doing a different, easier idea instead.

## What this is not

- Not a license to skip. "I can't run it" is the start of a hand-off, not the end of the work.
- Not a reason to substitute another idea. next-idea executes the top eligible idea; see `../skills/next-idea/SKILL.md` and `../PRIORITIZATION.md`.
- Not a chat note. Owner steps and blockers live in the checkpoint and `notes`, so the next run and the Web UI both see them.

## See also

- [`../PRIORITIZATION.md`](../PRIORITIZATION.md) — eligibility and the `checkpoint.status` signal.
- [`../docs/priorities-registry.md`](../docs/priorities-registry.md) — `checkpoint.status` `Ready` vs `In Review`.
- [`anti-rationalization.md`](anti-rationalization.md) — the excuses this rule defeats.
- [`evidence-and-verification.md`](evidence-and-verification.md) — verify what you can, record it.
