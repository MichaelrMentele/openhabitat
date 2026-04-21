# Agent Guide — OpenHabitat

Notes for any AI agent (or human) working on this Starlight + MDX manual. These are the recurring traps and conventions worth knowing before you write or edit content.

## MDX gotchas

### `<` followed by a non-whitespace character is parsed as a JSX tag

This is the single most common breakage. In `.mdx` files, MDX runs the JSX parser on the content. Anything matching `<X...` where `X` is not whitespace gets interpreted as the start of a JSX element.

**Will break the build:**
- `<5 µg/m³` — parser sees `<5` and bails (digits can't start tag names): *"Unexpected character `5` (U+0035) before name."*
- `<5-hour nights` — same problem.
- `<custom-thing>` — parsed as a JSX element; will fail or render as an empty tag.
- `<a` followed by anything that doesn't close cleanly — parsed as an `<a>` anchor tag.

**Safe alternatives:**
- **`≤` (Unicode less-or-equal, U+2264)** — preferred. Reads cleanly, no escaping. `≤5 µg/m³`.
- **Add a space:** `< 5 µg/m³`. Whitespace breaks tag detection.
- **HTML entity:** `&lt;5 µg/m³`. Works but noisy in source.
- **Inline code:** `` `<5 µg/m³` ``. Code spans bypass JSX parsing entirely.

`>` is fine on its own — only `<` triggers the parser. So `>250 melanopic EDI` works without escaping.

**Plain `.md` files don't have this problem** — CommonMark treats `<5` as text. The trap is only `.mdx`.

**Detection:**
```bash
# Find all unescaped <DIGIT in .mdx files
grep -rEn "<[0-9]" src/content/docs --include="*.mdx"
```

**Fix in bulk:**
```bash
# Replace <DIGIT with ≤DIGIT across all mdx files
find src/content/docs -name "*.mdx" -type f -exec perl -i -pe 's/<(\d)/≤$1/g' {} \;
```

When introducing any new threshold or comparison in an `.mdx` file, default to `≤` and `≥` rather than `<` and `>`. Even if `>` works today, consistency makes future edits safer.

---

### Frontmatter `title:` is required on every content file

Starlight's `docsSchema()` requires `title` on every entry in the `docs` collection. A file with empty content or with only a body and no frontmatter will fail content sync with: *"docs → path/to/file data does not match collection schema. title: Required."*

Every new content file needs at minimum:
```yaml
---
title: Page Name
---
```

Use `draft: true` if the file isn't ready to ship; Starlight excludes drafts from `astro build` but keeps them visible in `astro dev`.

**Detection:**
```bash
find src/content/docs -type f \( -name "*.md" -o -name "*.mdx" \) | \
  while read f; do head -10 "$f" | grep -q "^title:" || echo "MISSING: $f"; done
```

---

### Index-file URLs are the parent path, not `parent/index/`

`src/content/docs/you/index.mdx` resolves to `/you/`, **not** `/you/index/`. Linking to `/you/index/` will 404. Same for any `index.md(x)` inside a subfolder.

---

### Partial files (`src/partials/`) live outside the `docs` collection

Reusable content fragments imported by multiple pages live in `src/partials/`, not under `src/content/docs/`. If you put them under `docs/`, Starlight tries to render them as routes and demands frontmatter. Putting them under `src/content/docs/_partials/` doesn't help either — Starlight's loader uses `**/[^_]*.mdx` which only matches the filename, not the directory.

When importing:
```mdx
import MyPartial from '~/partials/my-partial.mdx';
```

The `~` alias is configured in `tsconfig.json` to point at `src/`.

**Single-use partials are usually a code smell.** If only one page imports a partial, the indirection adds friction without saving duplication. Inline it.

---

### Markdown footnotes are page-scoped

`[^1]` references and their `[^1]: ...` definitions must live in the same file. You can't define a footnote in a partial and reference it from a host page (or vice versa). For citations inside partials, use inline links (`[Source name](url)`) instead.

---

### Sidebar slugs in `astro.config.mjs` must match real files

`{ slug: 'you/age' }` requires `src/content/docs/you/age.md` or `.mdx` to exist. Stale slugs after a rename produce: *"The slug 'you/age' specified in the Starlight sidebar config does not exist."*

When renaming or moving content files, also update:
- `astro.config.mjs` sidebar slugs
- Internal links in other content files
- Footnote URLs

**Link sweep:**
```bash
# All internal link targets
grep -rEoh "\]\(/[^)#]+(#[^)]*)?\)" src/content | grep -oE "/[^)#]+" | sed 's|^/||;s|/$||' | sort -u > /tmp/links.txt

# All actual route slugs
find src/content/docs -type f \( -name "*.md" -o -name "*.mdx" \) | \
  sed 's|.*/docs/||;s|\.mdx$||;s|\.md$||;s|/index$||' | sort -u > /tmp/docs.txt

# Broken links
comm -23 /tmp/links.txt /tmp/docs.txt
```

---

### Astro image imports fail at render if the file is missing

`import foo from '~/assets/foo.png'` succeeds at parse time but **errors when the page renders** if `src/assets/foo.png` doesn't exist. If you're scaffolding an image reference before the file exists, comment out the import + the `<Image>` usage:

```mdx
{/* TODO: save image to src/assets/foo.png and uncomment:
import { Image } from 'astro:assets';
import foo from '~/assets/foo.png';
*/}

{/* TODO: <Image src={foo} alt="..." /> */}
```

---

### Verifying changes

After any structural change, run:
```bash
pnpm astro sync
```

This validates the content collection schema and exposes broken imports before you boot the dev server. Cheap, fast, do it often.

For a full check including dev render:
```bash
(pnpm dev > /tmp/dev.log 2>&1 &) && sleep 10 && cat /tmp/dev.log && pkill -f "astro dev"
```

---

## Content conventions

### Page template (`src/templates/manual_entry.md`)

Topic pages follow:
- `## Problem` — status quo, what's broken
- `## Goal` — ideal future, with a target table where applicable
- `## Gap` — delta between the two
- `## Solution` — physics + measures, mirrored against Gap axes
- `---` (horizontal-rule seam)
- `## System` — implementation: products, vendors, sizing
- `## Deploy` — setup + maintenance
- `## Proof` — evidence the system works (link to measurable outcomes on `/you/`)

Other templates:
- `src/templates/buying_decision.md` — single-product decision pages (What We Were Looking For / Key Directions Explored / What We Selected / Why)
- `src/templates/case_study.md` — Before / Changes / After

### Asides for rationale

Tables and checklists get a tip-style Aside underneath capturing rationale (Measures / Vendor / Frequency or similar). Pattern:

```mdx
| Header | Header |
| --- | --- |
| ... | ... |

<Aside type="tip" title="Rationale">
- **Measures:** ...
- **Vendor:** ...
- **Frequency:** ...
</Aside>
```

`<Aside>` is imported from `@astrojs/starlight/components`.

### Citations

- Inline `[^N]` in prose
- `## References` section at the end of the page with `[^N]: Author, ["Title"](url) *Journal* (Year).`
- Use `https://doi.org/...` URLs for journal articles — stable redirector
- Org-level sources (CDC/WHO/EPA): link to the relevant landing page
- One footnote per claim; reuse numbers within the same page if the same source is cited multiple times

### Defer to system pages

Space pages (`habitat/spaces/*`) should not re-explain how to manage Air, Water, Light, Sound, etc. Link to the canonical System page for product picks and methodology; only call out **space-specific considerations** (e.g., bedroom CO2 buildup overnight, kitchen water filtration for cooking).

### Acronyms

Expand on first use within a page: `PFAS (per- and polyfluoroalkyl substances)`, `DEXA (Dual-Energy X-ray Absorptiometry)`, etc. Common knowledge stays bare (DNA, MRI, IQ).

---

## Repo layout shortcuts

```
src/
  content/
    docs/                     ← all routable Starlight pages
      intro.md                ← landing redirect target (/ → /intro/)
      about.md
      give.md
      you/
        index.mdx             ← /you/ (the You page; titled "You")
        rhythms/              ← daily/weekly/monthly/yearly checklists
      habitat/
        index.md              ← /habitat/
        systems/              ← air, water, light, sound, etc. (canonical reference)
        spaces/               ← bedroom, kitchen, etc. (task pages)
  partials/                   ← reusable fragments (NOT in docs collection)
  components/                 ← .astro components if needed
  templates/                  ← documentation templates (NOT routable)
  assets/                     ← images referenced by MDX <Image>
content.config.ts             ← only declares the `docs` collection
astro.config.mjs              ← sidebar config + redirects
```

Anything in `src/content/products/`, `src/content/case-studies/`, or other top-level dirs that aren't declared as collections in `content.config.ts` is **dead** — Starlight ignores them. Don't put content there expecting it to render.
