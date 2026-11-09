---
name: figcraft-dev-mode
description: Inspect this project's FigCraft design file through Developer (Dev) Mode. Use whenever a task involves the Homacom design, a Figma/FigCraft frame, layer, component, spacing, colour or font token, or converting design to Vue/Tailwind. Triggers on "Frame 3294", "the design", "figcraft", "Figma", "Dev Mode", "inspect properties", "handoff", "get the CSS/Vue for this frame".
user-invocable: true
allowed-tools: Read, Glob, Grep
---

# FigCraft Dev Mode (Homacom)

The source of truth for UI work in this repo is the FigCraft file. Always read it
through **Developer Mode** — never eyeball the canvas alone, and never guess
colours, sizes, fonts or gaps.

## Design file

| What | Value |
| --- | --- |
| File | `/home/masoudi/Projects/pouria/homacom-figma/Homacom (Copy).figcraft` |
| App | `/home/masoudi/Projects/pouria/homacom-figma/figcraft-0.17.0-linux-x86_64.AppImage` |
| Pages | `Desktop` (id `2`, current) · `Mobile` (id `79762`) |
| Units | px, y-down; frames are the responsive tiers used in `app/` |

The file is normally already open. Verify with `tools["figcraft"].inspect_ui()`
(`status.path`, `status.page`) before touching anything. If it is not open, call
`tools["figcraft"].open_file({ path })`.

## Non-negotiable workflow

1. **Find the layer** — `node.find` is scoped to the current page, so run it per
   page (`root` = page id) or switch pages with `page.select` first.
   ```jsonc
   {"command":"node.find","params":{"name":"Frame 3294","limit":50}}
   {"command":"node.find","params":{"root":79762,"name":"Frame 3294"}}
   ```
2. **Disambiguate** — names repeat across pages and components. Confirm the
   parent with `select.layersAt` at a point inside `absoluteBounds`.
3. **Enter Dev Mode before reading anything** —
   ```jsonc
   {"command":"view.devMode","params":{}}   // Shift+D; idempotent toggle-on
   ```
4. **Select the frame** — `tools["figcraft"].select({ ids:[<id>] })`.
5. **Read the handoff data** (this is Dev Mode's payload):
   - `inspect.properties` → layout, auto layout, typography, fills, strokes,
     effects, tokens/style names.
   - `inspect.code` → framework code. Use `language:"vue"` for this project;
     add `language:"tailwind"` + `mobile:<mobile frame id>` for the
     mobile-first + `lg:` split this repo uses (see AGENTS.md breakpoints).
   - `inspect.assets` → export settings, SVG icons, PNG images.
   - `devResource.list`, `annotation.list`, `devMode.measurements` → links,
     notes and pinned measurements.
   - `dev.compare` → what changed since the frame was marked ready for dev.
6. **Look at it** — `tools["figcraft"].screenshot({ ids:[<id>], maxSize:900 })`
   and actually inspect the returned image before writing code.
7. **Report tokens, don't invent them** — quote the values Dev Mode returns.
   Map to existing `app/assets/css/tailwind.css` variables and repo components
   before creating new utilities.

## Dev Mode command reference

| Command | Use |
| --- | --- |
| `view.devMode` | Turn Developer Mode on (`Shift+D`) |
| `dev.focus {id}` · `dev.unfocus` | Isolate one frame on the canvas |
| `dev.compare {id}` | Changes since marked / since a version |
| `dev.resolveChange {ids}` | Accept changes, back to Ready for dev |
| `inspect.properties {id}` | Sectioned property rows with token names |
| `inspect.code {id, language, mobile?, unit?, rootFontSize?}` | CSS / Vue / React / SwiftUI / Compose / Flutter |
| `inspect.assets {ids}` | Assets to hand over (export / icon / image) |
| `inspect.readyForDev {status, page}` | Handoff queue |
| `inspect.componentCode {id, language}` | Component definition + usage |
| `codeConnect.set / export / import` | Link components to repo code |
| `devResource.add / list` | URLs for developers on a layer |
| `annotation.add / list` | Pinned property notes + categories |
| `devMode.addMeasurement / measurements` | Persistent redlines |
| `measure.distances` · `measure.padding` | Ad-hoc spacing (Alt / Shift+Alt hover) |
| `node.set {devStatus}` | Mark readyForDev / completed |
| `export` · `run_command file.exportLayers` | Write PNG/SVG/PDF (use `assets:true`) |

MCP surface: `list_commands` discovers every command; `run_command` runs one;
`batch` runs several as **one** undo step; `get_node` / `inspect_document` read
JSON; `select` / `set_properties` / `create_node` mutate.

## Known anchors

`Frame 3294` exists **twice** — same happy-path product buy box (324×735,
Samsung Galaxy A05s card + price/CTA + colour/warranty + 3 delivery rows):

| Id | Parent | Page | Position (page) |
| --- | --- | --- | --- |
| `4221` | `Product-single-desktop` (`3289`) | Desktop | x 12379, y 15050 |
| `5690` | `Product single` (`4736`) | Desktop | x 13859, y 14946 |

Use `4221` as the canonical desktop variant; check `5690` before claiming a
difference between the two product-single screens.

Key tokens seen in this frame (verify, don't hard-code blindly):
`#EF233C` brand red · `#FFF2F4` tint · `#1D1D1F` text · `#6B7280` muted ·
`#9CA3AF` / `#E5E7EB` / `#EBEDF0` borders · `#FFFFFF` surface ·
font `Arad` (Regular Dots2) at 11.25–18px · radius 7/12/16.

## Rules

- Always `view.devMode` **before** quoting design values.
- Never invent spacing, colour, radius, font size or shadow values.
- Cross-check every colour/font against `app/assets/css/tailwind.css` tokens.
- Only `lg:` and base breakpoints exist; drop `sm:`/`md:`/`xl:` from generated
  code and justify any new tier first.
- RTL/Persian copy: keep `dir="rtl"`, right-aligned text, and Persian numerals
  as designed.
- Mutating the design file is opt-in only; read-first unless asked to edit.
- After edits to the design *or* to this skill, re-read with `inspect_document`
  to verify.
