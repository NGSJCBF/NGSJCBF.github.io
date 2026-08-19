# Graduation Starfield Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the game-like graduation footer with a 5.8-second abstract starfield that gathers scattered memories into a quiet closing sentence.

**Architecture:** Keep the existing Hugo shortcode resource pipeline and split responsibilities across the shortcode template, one dedicated CSS file, and one vanilla JavaScript initializer. The template will render a static, accessible final state; CSS will own all deterministic star movement and theme/responsive behavior; JavaScript will only add the one-time ga-play state when the component enters the viewport.

**Tech Stack:** Hugo templates, Hugo asset pipeline, HTML, CSS keyframes/custom properties, inline SVG, vanilla JavaScript IntersectionObserver.

## Global Constraints

- The visual direction is “星光汇流”; stars remain abstract and do not use article photos or location images.
- The final copy is exactly “因为那个暑假，以后大概真的不会再有了。”.
- The animation lasts approximately 5.8 seconds, plays once when scrolled into view, and remains still after completion.
- Remove ACHIEVEMENT UNLOCKED, graduation hats, the ring/progress indicator, fire trail, and BACHELOR → MASTER.
- Do not add images, fonts, third-party animation libraries, audio, random trajectories, or new runtime dependencies.
- Use transform, opacity, and limited filter glow for motion; do not run per-frame JavaScript.
- The final copy must remain available when JavaScript is missing, when IntersectionObserver is unavailable, and when prefers-reduced-motion is enabled.
- Support the existing light/dark theme selectors, desktop layout, and approximately 375px-wide mobile screens without layout shifts.
- Do not modify content/posts/我的大学四年/index.md, assets/css/custom.css, or unrelated theme files.

---

## File Map

- Modify layouts/shortcodes/graduation-achieved.html: preserve one-time resource loading and replace the achievement markup with the accessible starfield DOM contract.
- Modify assets/css/graduation-achieved.css: replace ring/hat/fire CSS with the static starfield, constellation reveal, final-copy brightening, theme rules, responsive rules, and reduced-motion rules.
- Modify assets/js/graduation-achieved.js: preserve one-time initialization and viewport triggering, add the readiness/static fallback states, and keep multiple shortcode instances independent.
- Create no test framework or runtime dependency; verification uses Hugo build output, node --check, PowerShell assertions, and manual browser checks.
- Do not modify docs/superpowers/specs/2026-08-19-graduation-achieved-starfield-design.md; it is the approved design source.

## Interfaces Between Files

- The template exposes one root element with class grad-achieve, data-grad-achieve, and aria-labelledby pointing to the time marker and final copy.
- The template exposes .ga-meta, .ga-stage, .ga-sky, .ga-star, .ga-constellation, .ga-copy, and .ga-final for CSS.
- JavaScript only adds ga-ready, ga-play, or ga-static to the root; CSS must render a usable state without any of those classes.
- CSS custom properties on each .ga-star provide fixed --ga-from-x, --ga-from-y, --ga-to-x, --ga-to-y, --ga-delay, --ga-duration, and --ga-opacity values; JavaScript must not alter them.

## Task 1: Replace the achievement markup with the starfield structure

**Files:**
- Modify: layouts/shortcodes/graduation-achieved.html:11-39
- Test: PowerShell content assertions against layouts/shortcodes/graduation-achieved.html

**Interfaces:**
- Consumes: the existing $id, page resource store, minified/fingerprinted CSS and JS resources.
- Produces: the DOM and class contract consumed by Task 2 CSS and Task 3 JavaScript.

- [ ] **Step 1: Write the markup contract assertion before editing.**

Run this from the repository root; it must fail against the current achievement markup because ga-meta and ga-final do not exist yet:

~~~powershell
$path = 'layouts/shortcodes/graduation-achieved.html'
$html = Get-Content -Encoding utf8 -Raw $path
if ($html -notmatch 'class="ga-meta"' -or $html -notmatch 'class="ga-final"') {
  throw 'Expected starfield markup is not present yet.'
}
~~~

Expected before the change: FAIL with Expected starfield markup is not present yet.

- [ ] **Step 2: Preserve the resource-loading block and replace only the rendered component.**

Keep lines 2–9, including $id, Page.Store, resources.Get, minification, fingerprinting, and defer. Replace the current rendered block with this structure:

~~~html
<div id="{{ $id }}" class="grad-achieve" data-grad-achieve aria-labelledby="{{ $id }}-meta {{ $id }}-final">
  <div id="{{ $id }}-meta" class="ga-meta">2022 — 2026</div>

  <div class="ga-stage" aria-hidden="true">
    <div class="ga-sky"></div>
    <div class="ga-stars">
      <span class="ga-star" style="--ga-from-x:-132px;--ga-from-y:92px;--ga-to-x:-46px;--ga-to-y:18px;--ga-delay:.72s;--ga-duration:1.58s;--ga-opacity:.72"></span>
      <span class="ga-star" style="--ga-from-x:118px;--ga-from-y:76px;--ga-to-x:36px;--ga-to-y:-20px;--ga-delay:.86s;--ga-duration:1.46s;--ga-opacity:.8"></span>
      <span class="ga-star" style="--ga-from-x:-104px;--ga-from-y:-72px;--ga-to-x:-18px;--ga-to-y:-30px;--ga-delay:.98s;--ga-duration:1.62s;--ga-opacity:.6"></span>
      <span class="ga-star" style="--ga-from-x:136px;--ga-from-y:-58px;--ga-to-x:28px;--ga-to-y:28px;--ga-delay:1.08s;--ga-duration:1.55s;--ga-opacity:.76"></span>
      <span class="ga-star" style="--ga-from-x:-72px;--ga-from-y:118px;--ga-to-x:-8px;--ga-to-y:8px;--ga-delay:1.16s;--ga-duration:1.48s;--ga-opacity:.9"></span>
      <span class="ga-star" style="--ga-from-x:84px;--ga-from-y:112px;--ga-to-x:16px;--ga-to-y:10px;--ga-delay:1.24s;--ga-duration:1.52s;--ga-opacity:.66"></span>
      <span class="ga-star" style="--ga-from-x:-154px;--ga-from-y:-12px;--ga-to-x:-34px;--ga-to-y:2px;--ga-delay:1.3s;--ga-duration:1.45s;--ga-opacity:.74"></span>
      <span class="ga-star" style="--ga-from-x:152px;--ga-from-y:18px;--ga-to-x:42px;--ga-to-y:8px;--ga-delay:1.38s;--ga-duration:1.5s;--ga-opacity:.58"></span>
      <span class="ga-star" style="--ga-from-x:-42px;--ga-from-y:-126px;--ga-to-x:-10px;--ga-to-y:-8px;--ga-delay:1.42s;--ga-duration:1.56s;--ga-opacity:.82"></span>
      <span class="ga-star" style="--ga-from-x:42px;--ga-from-y:-132px;--ga-to-x:12px;--ga-to-y:-18px;--ga-delay:1.5s;--ga-duration:1.5s;--ga-opacity:.68"></span>
      <span class="ga-star" style="--ga-from-x:-124px;--ga-from-y:42px;--ga-to-x:-26px;--ga-to-y:36px;--ga-delay:1.56s;--ga-duration:1.42s;--ga-opacity:.64"></span>
      <span class="ga-star" style="--ga-from-x:128px;--ga-from-y:-34px;--ga-to-x:30px;--ga-to-y:-42px;--ga-delay:1.62s;--ga-duration:1.44s;--ga-opacity:.72"></span>
    </div>

    <svg class="ga-constellation" viewBox="0 0 360 250" focusable="false">
      <path d="M139 126 L163 108 L185 119 L210 104 L224 128 L198 143 L170 138 Z"></path>
      <circle cx="139" cy="126" r="2.2"></circle>
      <circle cx="163" cy="108" r="2.2"></circle>
      <circle cx="185" cy="119" r="2.2"></circle>
      <circle cx="210" cy="104" r="2.2"></circle>
      <circle cx="224" cy="128" r="2.2"></circle>
      <circle cx="198" cy="143" r="2.2"></circle>
      <circle cx="170" cy="138" r="2.2"></circle>
    </svg>
  </div>

  <div class="ga-copy">
    <p id="{{ $id }}-final" class="ga-final">因为那个暑假，以后大概真的不会再有了。</p>
  </div>
</div>
~~~

The inline custom properties are deterministic art direction, not random data. Keep the SVG decorative with aria-hidden on the containing stage; keep the final sentence as real text in the DOM.

- [ ] **Step 3: Run the markup assertions after editing.**

~~~powershell
$path = 'layouts/shortcodes/graduation-achieved.html'
$html = Get-Content -Encoding utf8 -Raw $path
$required = @('data-grad-achieve', 'class="ga-meta"', 'class="ga-stage"', 'class="ga-stars"', 'class="ga-constellation"', 'class="ga-final"', '因为那个暑假，以后大概真的不会再有了。')
foreach ($token in $required) {
  if ($html -notmatch [regex]::Escape($token)) { throw "Missing markup token: $token" }
}
$forbidden = @('ACHIEVEMENT UNLOCKED', 'BACHELOR', 'ga-ring', 'ga-hat', 'ga-trail', 'ga-impact')
foreach ($token in $forbidden) {
  if ($html -match [regex]::Escape($token)) { throw "Obsolete markup token remains: $token" }
}
~~~

Expected: no output and exit code 0.

- [ ] **Step 4: Commit the self-contained markup change.**

~~~powershell
git add -- layouts/shortcodes/graduation-achieved.html
git diff --cached --check
git commit -m "refactor: replace graduation achievement markup"
~~~

## Task 2: Implement the deterministic starfield and final-copy animation in CSS

**Files:**
- Modify: assets/css/graduation-achieved.css:1-end
- Test: CSS token assertions, git diff --check, and Hugo build in Task 4

**Interfaces:**
- Consumes: .grad-achieve, .ga-meta, .ga-stage, .ga-sky, .ga-star, .ga-constellation, .ga-copy, and .ga-final from Task 1.
- Produces: static fallback, ga-play animation state, ga-static fallback state, theme/responsive rules, and reduced-motion behavior for Task 3 and Task 4.

- [ ] **Step 1: Write the CSS contract assertion before replacing the stylesheet.**

~~~powershell
$path = 'assets/css/graduation-achieved.css'
$css = Get-Content -Encoding utf8 -Raw $path
if ($css -notmatch 'ga-ring' -or $css -notmatch 'ga-hat') {
  throw 'The baseline stylesheet is expected to contain obsolete achievement selectors.'
}
~~~

Expected before the change: no exception, confirming the baseline to remove.

- [ ] **Step 2: Replace the base component and static fallback rules.**

Define the root with position:relative, width:min(100%, 680px), centered margins, stable padding, overflow:hidden, and isolation:isolate. Use only these palette variables: cool white/blue stars, a muted blue-gray sky glow, and one warm cream constellation accent. Keep the background transparent apart from a low-opacity radial gradient.

The static contract must be visible before JavaScript runs:

~~~css
.ga-meta {
  color: color-mix(in srgb, currentColor 58%, transparent);
  font-size: .62rem;
  letter-spacing: .24em;
}

.ga-stage {
  position: relative;
  width: min(100%, 360px);
  height: 250px;
  margin: 12px auto 0;
}

.ga-final {
  max-width: 25em;
  margin: 0 auto;
  color: color-mix(in srgb, currentColor 82%, transparent);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1rem, 2.8vw, 1.22rem);
  line-height: 1.9;
  opacity: .72;
}

.ga-star {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--ga-star-color, #d8edff);
  box-shadow: 0 0 9px var(--ga-star-glow, rgba(140, 204, 255, .72));
  opacity: var(--ga-opacity, .72);
  transform: translate(calc(-50% + var(--ga-to-x)), calc(-50% + var(--ga-to-y)));
}
~~~

Add a static constellation with a low but visible opacity so no-JS and reduced-motion states still show a complete visual ending.

- [ ] **Step 3: Add the 5.8-second ga-play timeline.**

Use the inline custom properties from Task 1 to animate every star with one shared keyframe and per-star delay/duration. The keyframe must begin at --ga-from-x/--ga-from-y with low opacity and scale .45, pass through a soft mid-flight opacity peak, and finish at --ga-to-x/--ga-to-y without overshoot.

~~~css
.grad-achieve.ga-play .ga-star {
  animation: ga-star-gather var(--ga-duration) cubic-bezier(.22, .72, .22, 1) var(--ga-delay) forwards;
}

@keyframes ga-star-gather {
  0% {
    opacity: 0;
    transform: translate(calc(-50% + var(--ga-from-x)), calc(-50% + var(--ga-from-y))) scale(.45);
  }
  58% { opacity: 1; }
  100% {
    opacity: var(--ga-opacity);
    transform: translate(calc(-50% + var(--ga-to-x)), calc(-50% + var(--ga-to-y))) scale(1);
  }
}
~~~

Schedule the constellation so its lines and points strengthen from about 2.5s to 4.5s, then hold. Schedule a short, non-looping central glow at about 3.8s. Move no elements after 5.8s. Raise .ga-final from .72 opacity to 1 with a 1.3-second animation delayed to 4.5s; this keeps the sentence readable in the static state while creating a quiet reveal during playback.

- [ ] **Step 4: Add theme, mobile, and reduced-motion rules.**

Use the existing .dark ancestor convention for dark theme adjustments. Keep the composition unchanged and only adjust star/line colors, glow strength, and final-copy contrast. At max-width:500px, use a stage height near 220px, reduce star travel offsets with a stage scale or compact custom properties, and keep the final copy at or above 1rem with 1.8 line-height.

The reduced-motion rule must cancel all movement and show the final state:

~~~css
@media (prefers-reduced-motion: reduce) {
  .grad-achieve *,
  .grad-achieve *::before,
  .grad-achieve *::after {
    animation: none !important;
    transition: none !important;
  }

  .grad-achieve .ga-star {
    opacity: var(--ga-opacity, .72);
    transform: translate(calc(-50% + var(--ga-to-x)), calc(-50% + var(--ga-to-y)));
  }

  .grad-achieve .ga-constellation,
  .grad-achieve .ga-final {
    opacity: 1;
  }
}
~~~

- [ ] **Step 5: Verify CSS invariants and commit the CSS change.**

~~~powershell
$path = 'assets/css/graduation-achieved.css'
$css = Get-Content -Encoding utf8 -Raw $path
$required = @('ga-star-gather', 'ga-constellation', 'prefers-reduced-motion', '--ga-from-x', '--ga-to-x', 'ga-final')
foreach ($token in $required) {
  if ($css -notmatch [regex]::Escape($token)) { throw "Missing CSS token: $token" }
}
$obsolete = @('ga-ring', 'ga-hat', 'ga-trail', 'ga-impact', 'ga-bachelor', 'ga-master', 'ga-ring-spin', 'ga-master-pulse')
foreach ($token in $obsolete) {
  if ($css -match [regex]::Escape($token)) { throw "Obsolete CSS token remains: $token" }
}
~~~

Expected: no output and exit code 0.

~~~powershell
git add -- assets/css/graduation-achieved.css
git diff --cached --check
git commit -m "feat: animate graduation memories as a starfield"
~~~

## Task 3: Update the viewport initializer and static fallbacks

**Files:**
- Modify: assets/js/graduation-achieved.js:1-47
- Test: node --check assets/js/graduation-achieved.js and DOM-state assertions in the implementation review

**Interfaces:**
- Consumes: [data-grad-achieve] roots from Task 1 and the ga-play/ga-static CSS states from Task 2.
- Produces: one-time initialization, ga-ready readiness marker, and exactly-once viewport trigger.

- [ ] **Step 1: Preserve the existing initialization guard and add readiness.**

Keep the IIFE, DOMContentLoaded branch, querySelectorAll('[data-grad-achieve]'), and data-ga-initialized guard. Immediately after setting element.dataset.gaInitialized = 'true', add:

~~~js
element.classList.add('ga-ready');
~~~

Do not hide .ga-final in the readiness state; the CSS static state must remain readable before playback.

- [ ] **Step 2: Make missing IntersectionObserver use the static state.**

Replace the current fallback that adds ga-play with:

~~~js
if (!('IntersectionObserver' in window)) {
  element.classList.add('ga-static');
  return;
}
~~~

This ensures unsupported browsers do not attempt to run a motion sequence while still receiving the final constellation and sentence.

- [ ] **Step 3: Keep the observer one-shot and scoped to each element.**

Keep the existing threshold 0.38 and root margin 0px 0px -8% 0px. On the first intersecting entry, add ga-play to entry.target and immediately call observer.unobserve(entry.target). Do not add scroll listeners, timers, random values, or global mutable animation state.

The resulting observer body must retain this exact behavior:

~~~js
if (!entry.isIntersecting) {
  return;
}

entry.target.classList.add('ga-play');
observer.unobserve(entry.target);
~~~

- [ ] **Step 4: Run the JavaScript syntax check and inspect the state contract.**

~~~powershell
node --check assets/js/graduation-achieved.js
~~~

Expected: exit code 0 and no syntax error. Then verify the state tokens:

~~~powershell
$js = Get-Content -Encoding utf8 -Raw 'assets/js/graduation-achieved.js'
foreach ($token in @('ga-ready', 'ga-static', 'ga-play', 'IntersectionObserver', 'unobserve')) {
  if ($js -notmatch [regex]::Escape($token)) { throw "Missing JavaScript state token: $token" }
}
~~~

- [ ] **Step 5: Commit the JavaScript change.**

~~~powershell
git add -- assets/js/graduation-achieved.js
git diff --cached --check
git commit -m "fix: preserve graduation animation fallbacks"
~~~

## Task 4: Build the Hugo page and perform visual/accessibility verification

**Files:**
- Modify: none unless a verification failure identifies a defect in the three animation files
- Test: Hugo build, generated HTML/resource checks, and manual visual checks

**Interfaces:**
- Consumes: the completed shortcode, CSS, and JavaScript contracts from Tasks 1–3.
- Produces: verified generated page and a clean, scoped final diff.

- [ ] **Step 1: Build the site with Hugo.**

~~~powershell
hugo --minify --destination public
~~~

Expected: Hugo exits 0 and generates public/index.html plus the article output. If the environment again reports hugo.exe as access denied, rerun this same command through the approved elevated execution path; treat the permission error as an environment issue, not as a successful build.

- [ ] **Step 2: Assert the generated article contains the new component and no old achievement copy.**

~~~powershell
$article = Get-ChildItem -Path 'public' -Recurse -File -Filter 'index.html' |
  Select-String -Pattern '因为那个暑假，以后大概真的不会再有了。' -List |
  Select-Object -First 1
if (-not $article) { throw 'Generated article does not contain the final copy.' }

$old = Get-ChildItem -Path 'public' -Recurse -File -Filter 'index.html' |
  Select-String -Pattern 'ACHIEVEMENT UNLOCKED|BACHELOR|Graduation Achieved' -List
if ($old) { throw 'Generated HTML still contains obsolete achievement copy.' }
~~~

Expected: the final copy is found and the obsolete-copy query returns no matches.

- [ ] **Step 3: Run whitespace and scope checks.**

~~~powershell
git diff --check HEAD~3..HEAD
git status --short
~~~

Expected: no whitespace errors. The committed animation changes must be limited to layouts/shortcodes/graduation-achieved.html, assets/css/graduation-achieved.css, and assets/js/graduation-achieved.js; the pre-existing content/posts/我的大学四年/index.md, assets/css/custom.css, and visual-companion files must remain outside the implementation commits.

- [ ] **Step 4: Perform the manual visual matrix.**

Run a local preview with:

~~~powershell
hugo server --disableFastRender
~~~

Open the article containing the graduation-achieved shortcode and check each case:

1. Desktop light theme: sparse stars enter, gather by about 3.8s, hold, and brighten the final sentence by 5.8s.
2. Desktop dark theme: star and copy contrast remain comfortable without a neon game look.
3. Narrow viewport around 375px: no horizontal overflow, no clipped constellation, and the full Chinese sentence remains readable.
4. Scroll away and back: the animation does not replay.
5. Disable JavaScript: the final sentence and static constellation remain visible.
6. Use a browser setting or DevTools emulation for reduced motion: no visible travel or flashing; the final state is immediately readable.
7. Inspect with a screen reader or accessibility tree: decorative starfield is hidden and the final sentence is the meaningful label.

- [ ] **Step 5: Review the final diff and commit only the implementation files.**

~~~powershell
git diff --stat
git status --short
git diff --check
~~~

If all checks pass, the three implementation files are the only files to stage:

~~~powershell
git add -- layouts/shortcodes/graduation-achieved.html assets/css/graduation-achieved.css assets/js/graduation-achieved.js
git diff --cached --name-only
git diff --cached --check
git commit -m "feat: redesign graduation ending animation"
~~~

Expected staged paths, and only these paths:

~~~text
assets/css/graduation-achieved.css
assets/js/graduation-achieved.js
layouts/shortcodes/graduation-achieved.html
~~~

## Plan Self-Review Checklist

- Spec coverage: timeline, abstract starfield, final copy, one-shot trigger, static/no-JS fallback, reduced motion, themes, mobile layout, no new dependencies, accessibility, build checks, and scoped file changes are each assigned to Tasks 1–4.
- Placeholder scan: no task depends on unfinished markers, an unspecified selector, a random trajectory, or a missing test command.
- Interface consistency: the class names and custom-property names in the template, CSS, and JavaScript sections match exactly: ga-ready, ga-static, ga-play, ga-star, ga-constellation, and ga-final.
- Scope: the work is one cohesive frontend animation subsystem; it does not require a second spec or a new dependency.
