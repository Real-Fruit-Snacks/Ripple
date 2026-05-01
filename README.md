<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Ripple/main/docs/assets/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Ripple/main/docs/assets/logo-light.svg">
  <img alt="Ripple" src="https://raw.githubusercontent.com/Real-Fruit-Snacks/Ripple/main/docs/assets/logo-dark.svg" width="100%">
</picture>

> [!IMPORTANT]
> **Browser-based Vim editor powered by CodeMirror 6.** Full Vim keybindings in a zero-dependency static site. Catppuccin Mocha theme, split panes, tabs, virtual filesystem. No server required — deploy anywhere that serves HTML. Ships as a single HTML + JS bundle (~740 KB) with no external requests, no frameworks, and no runtime dependencies.

> *A ripple is the smallest disturbance that still propagates. Felt fitting for an editor that drops into a static page and behaves like vim.*

---

## §1 / Premise

Ripple is a **full Vim editor** in the browser. Modal editing — Insert, Normal, Visual, Replace — with motions, operators, text objects, registers, macros, and `.` repeat. Backed by `@replit/codemirror-vim` over CodeMirror 6, the most complete Vim implementation for the web. Splits and tabs work as you'd expect from `:vsplit`, `:tabnew`, `Ctrl-W h/j/k/l`, `gt`/`gT`. A localStorage-backed virtual filesystem persists files across sessions; seven example files ship by default.

esbuild produces a single minified bundle. Open `index.html` from a `file://` URI and everything works — no fetch, no WebSocket, no server.

▶ **[Live demo](https://Real-Fruit-Snacks.github.io/Ripple/)**

---

## §2 / Specs

| KEY        | VALUE                                                                       |
|------------|-----------------------------------------------------------------------------|
| BUNDLE     | **~740 KB** · single `vim.js` · esbuild minified                            |
| VIM        | **Full** · Insert · Normal · Visual · Replace · motions · operators · text objects · registers · macros · `.` repeat |
| SPLITS     | Horizontal + vertical · drag-to-resize · `Ctrl-W h/j/k/l` navigation        |
| TABS       | Tab bar with modified indicators · `gt`/`gT` cycling · close-protect on dirty |
| FILESYSTEM | localStorage-backed · `:w` `:e` `:saveas` `:rm` `:files`                    |
| LANGUAGES  | **9** · JS · TS · JSX · TSX · HTML · CSS · Python · Markdown · JSON          |
| THEME      | **Catppuccin Mocha** · 35+ token mappings · color-coded mode badge          |
| RUNTIME    | **Zero deps** · no CDN, no fetch, no WebSocket · works from `file://`       |
| STACK      | **CodeMirror 6** + `@replit/codemirror-vim` · esbuild · vanilla DOM · MIT   |

Architecture in §5 below.

---

## §3 / Quickstart

Requires **Node.js 18+**.

```bash
git clone https://github.com/Real-Fruit-Snacks/Ripple.git
cd Ripple
npm install

npm run build       # production build (minified) → dist/
npm run dev         # development build with watch + live server
```

Output is placed in `dist/`. Open `dist/index.html` in any browser, or upload to any static host (GitHub Pages, GitLab Pages, S3, nginx).

```bash
ls -la dist/                 # check build output
npx eslint src/              # lint source
```

---

## §4 / Reference

```
MODES + MOTIONS

  Movement       h j k l w b e 0 $ gg G { } %
  Editing        i a I A o O r R x dd D yy p P
  Operators      d c y > < =   (combined with motions / text objects)
  Text Objects   iw aw i" a" i( a( i{ a{
  Visual         v V Ctrl-V
  Search         / ? n N * #
  Undo / Redo    u Ctrl-R
  Repeat         .

SPLITS

  Ctrl-W s             horizontal split
  Ctrl-W v             vertical split
  Ctrl-W h/j/k/l       navigate between splits
  Ctrl-W c             close current split
  Ctrl-W o             close all other splits
  :split [file]        horizontal split (ex command)
  :vsplit [file]       vertical split (ex command)

TABS

  :tabnew [file]       open file in new tab
  :tabnext             next tab          (or gt)
  :tabprevious         previous tab      (or gT)
  :tabclose            close current tab

FILESYSTEM

  :w [file]            save buffer
  :e <file>            open file
  :saveas <file>       save as new filename
  :enew                new empty buffer
  :rm <file>           delete file from filesystem
  :files               list all files
  :ls                  list open buffers

BATCH

  :wa                  write all modified buffers
  :qa                  quit all (warns on unsaved)
  :qa!                 force quit all
  :wqa                 write all and quit all
  :help                open built-in help buffer

MODE COLORS

  Normal      Blue   #89b4fa
  Insert      Green  #a6e3a1
  Visual      Mauve  #cba6f7
  Replace     Red    #f38ba8
```

---

## §5 / Architecture

```
src/
  main.js                Bootstrap · init app · register commands
  editor.js              CodeMirror EditorState/EditorView factory
  theme.js               Catppuccin Mocha palette + highlight rules
  languages.js           Language detection and loading
  commands.js            Ex command definitions (:w, :e, :q, etc.)
  keymaps.js             Vim action mappings (gt, Ctrl-W, etc.)
  fs/
    VirtualFS.js         localStorage-backed filesystem
    defaults.js          Default example files
  ui/
    App.js               Main shell and lifecycle
    TabBar.js            Tab strip with modified indicators
    StatusLine.js        Mode badge, position, file info
    Splits.js            Binary tree split pane manager
    Splash.js            Vim-style welcome screen

public/index.html        HTML shell (inline critical CSS)
build.js                 esbuild script
dist/                    Build output (deploy this)
  index.html
  vim.js                 Single bundled JS (~740 KB)
```

| Layer        | Implementation                                                  |
|--------------|-----------------------------------------------------------------|
| **Editor**   | CodeMirror 6 · `@replit/codemirror-vim` for modal editing       |
| **Splits**   | Binary tree pane manager · drag-to-resize dividers              |
| **Tabs**     | Hand-rolled · modified indicators · close-protect on dirty      |
| **FS**       | localStorage-backed VirtualFS · `:w`/`:e`/`:saveas`/`:rm`/`:files` |
| **Theme**    | Catppuccin Mocha · 35+ token mappings · CSS variables           |
| **UI**       | Vanilla DOM manipulation · no framework                         |
| **Build**    | esbuild · single minified bundle · zero runtime deps            |

**Key patterns:** No framework — direct DOM APIs for performance and zero overhead. Single bundle deploys anywhere that serves static files; no special headers required.

---

## §6 / Platform support

| Capability | Chrome | Firefox | Safari | Edge |
|------------|--------|---------|--------|------|
| Vim Keybindings | Full | Full | Full | Full |
| Split Panes | Full | Full | Full | Full |
| Tab System | Full | Full | Full | Full |
| Virtual Filesystem | Full | Full | Full | Full |
| Syntax Highlighting | Full | Full | Full | Full |
| Catppuccin Theme | Full | Full | Full | Full |
| File URI Loading | Full | Full | Limited | Full |

---

[License: MIT](LICENSE) · Part of [Real-Fruit-Snacks](https://github.com/Real-Fruit-Snacks) — building offensive security tools, one wave at a time.
