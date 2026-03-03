<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/banner.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/banner.svg">
  <img alt="Ripple" src="assets/banner.svg" width="800">
</picture>

<br>

**Browser-based Vim editor powered by CodeMirror 6**

[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-f9e2af?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Platform](https://img.shields.io/badge/Platform-Browser-89b4fa?style=flat-square&logo=googlechrome&logoColor=white)](.)
[![License](https://img.shields.io/badge/License-MIT-a6e3a1?style=flat-square)](.)

Full Vim keybindings in a zero-dependency static site. Catppuccin Mocha theme, split panes, tabs, virtual filesystem. No server required -- deploy anywhere that serves HTML.

> **Ships as a single HTML + JS bundle.** No external requests, no frameworks, no runtime dependencies.

</div>

---

## Table of Contents

- [Highlights](#highlights)
- [Quick Start](#quick-start)
- [Commands](#commands)
- [Keybindings](#keybindings)
- [Virtual Filesystem](#virtual-filesystem)
- [Architecture](#architecture)
- [Theming](#theming)
- [Deployment](#deployment)

---

## Highlights

<table>
<tr>
<td width="50%">

### Full Vim Mode

Insert, Normal, Visual, Replace modes with motions, operators, text objects, registers, macros, and `.` repeat. Powered by `@replit/codemirror-vim` -- the most complete Vim implementation for the browser.

</td>
<td width="50%">

### Catppuccin Mocha

Complete syntax highlighting with 35+ token-to-color mappings. Editor chrome, status line, tab bar, and splash screen all themed. Dark mode only, because that's the way.

</td>
</tr>
<tr>
<td width="50%">

### Split Panes

Horizontal and vertical splits with drag-to-resize dividers. `Ctrl-W h/j/k/l` spatial navigation. Multiple views of the same buffer with independent cursors. Close splits individually or keep only the focused pane.

</td>
<td width="50%">

### Tab System

Tab bar with modified indicators, click-to-switch, close buttons. `gt`/`gT` cycling. `:tabnew`, `:tabnext`, `:tabprev`, `:tabclose`. Modified buffers are protected from accidental close.

</td>
</tr>
<tr>
<td width="50%">

### Virtual Filesystem

localStorage-backed file persistence across sessions. Seven example files ship by default (JS, HTML, CSS, Python, Markdown, JSON). Standard `:w`/`:e` workflow. Files survive page refresh.

</td>
<td width="50%">

### Zero Dependencies

Single `vim.js` bundle (~740KB) produced by esbuild. No CDN, no fetch, no WebSocket, no server. Open `index.html` from a file URI and everything works. Deploy to GitHub Pages, GitLab Pages, S3, or any static host.

</td>
</tr>
<tr>
<td width="50%">

### Syntax Highlighting

JavaScript, TypeScript, JSX, TSX, HTML, CSS, Python, Markdown, and JSON. Language detection by file extension. Powered by CodeMirror's Lezer parser system for accurate, incremental highlighting.

</td>
<td width="50%">

### Vim-Style Status Line

Mode badge color-coded by state (Normal/Insert/Visual/Replace). Current filename with modified flag. Line:column position, file percentage, and filetype indicator. Command feedback displayed inline.

</td>
</tr>
</table>

---

## Quick Start

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 18+ | For building only |
| npm | 9+ | Package management |

### Build

```bash
# Install dependencies
npm install

# Production build (minified)
npm run build

# Development build with watch + live server
npm run dev
```

Output is placed in `dist/`. Open `dist/index.html` in any browser.

### Verify

```bash
# Check build output
ls -la dist/

# Lint source
npx eslint src/
```

---

## Commands

### File Operations

| Command | Short | Description |
|---------|-------|-------------|
| `:w [file]` | `:w` | Save buffer (optionally with new name) |
| `:e <file>` | `:e` | Open file |
| `:saveas <file>` | `:sav` | Save as new filename |
| `:enew` | `:ene` | New empty buffer in current window |
| `:rm <file>` | `:rm` | Delete file from virtual filesystem |

### Buffer Management

| Command | Short | Description |
|---------|-------|-------------|
| `:q` | `:q` | Close buffer (warns on unsaved changes) |
| `:q!` | `:q!` | Force close (discard changes) |
| `:wq` | `:wq` | Save and close |
| `:x` | `:x` | Save if modified, then close |
| `:bd` | `:bd` | Buffer delete (same as `:q`) |
| `:bd!` | `:bd!` | Force buffer delete |
| `:ls` | `:ls` | List open buffers |
| `:buffers` | | Alias for `:ls` |
| `:files` | | List all files in virtual filesystem |

### Tabs

| Command | Short | Description |
|---------|-------|-------------|
| `:tabnew [file]` | | Open file in new tab |
| `:tabnext` | `:tabn` | Next tab |
| `:tabprevious` | `:tabp` | Previous tab |
| `:tabclose` | `:tabc` | Close current tab |

### Splits

| Command | Short | Description |
|---------|-------|-------------|
| `:split [file]` | `:sp` | Horizontal split |
| `:vsplit [file]` | `:vs` | Vertical split |
| `:close` | `:clo` | Close current split |
| `:only` | `:on` | Close all other splits |
| `:new` | | New buffer in horizontal split |

### Batch Operations

| Command | Short | Description |
|---------|-------|-------------|
| `:wa` | `:wa` | Write all modified buffers |
| `:qa` | `:qa` | Quit all (warns on unsaved) |
| `:qa!` | `:qa!` | Force quit all |
| `:wqa` | `:wqa` | Write all and quit all |

### Other

| Command | Short | Description |
|---------|-------|-------------|
| `:help` | `:h` | Open built-in help buffer |
| `:set <option>` | `:set` | Set editor option |

---

## Keybindings

### Tab Navigation

| Key | Action |
|-----|--------|
| `gt` | Next tab |
| `gT` | Previous tab |

### Split Navigation

| Key | Action |
|-----|--------|
| `Ctrl-W s` | Horizontal split |
| `Ctrl-W v` | Vertical split |
| `Ctrl-W h` | Navigate left |
| `Ctrl-W j` | Navigate down |
| `Ctrl-W k` | Navigate up |
| `Ctrl-W l` | Navigate right |
| `Ctrl-W c` | Close split |
| `Ctrl-W o` | Close other splits |

### Vim Motions (built-in)

| Category | Keys |
|----------|------|
| Movement | `h` `j` `k` `l` `w` `b` `e` `0` `$` `gg` `G` `{` `}` `%` |
| Editing | `i` `a` `I` `A` `o` `O` `r` `R` `x` `dd` `D` `yy` `p` `P` |
| Operators | `d` `c` `y` `>` `<` `=` combined with motions/text objects |
| Text Objects | `iw` `aw` `i"` `a"` `i(` `a(` `i{` `a{` `it` `at` |
| Visual | `v` `V` `Ctrl-V` |
| Search | `/` `?` `n` `N` `*` `#` |
| Undo/Redo | `u` `Ctrl-R` |
| Repeat | `.` |

---

## Virtual Filesystem

Files are stored in `localStorage` with a `vfs:` key prefix. On first launch, seven example files are loaded:

| File | Language | Description |
|------|----------|-------------|
| `welcome.txt` | Text | Welcome message and quick reference |
| `hello.js` | JavaScript | JS example with functions and classes |
| `index.html` | HTML | HTML document template |
| `style.css` | CSS | Stylesheet with Catppuccin colors |
| `app.py` | Python | Python example with classes |
| `notes.md` | Markdown | Markdown formatting showcase |
| `config.json` | JSON | JSON configuration example |

Files persist across page reloads. Clear `localStorage` to reset to defaults.

---

## Architecture

```
ripple/
├── build.js                    esbuild script (watch/serve modes)
├── eslint.config.js            ESLint v9 flat config
├── package.json
├── public/
│   └── index.html              HTML shell (inline critical CSS)
├── src/
│   ├── main.js                 Bootstrap: init app, register commands
│   ├── editor.js               CodeMirror EditorState/EditorView factory
│   ├── theme.js                Catppuccin Mocha palette + highlight rules
│   ├── languages.js            Language detection and loading
│   ├── commands.js             Ex command definitions (:w, :e, :q, etc.)
│   ├── keymaps.js              Vim action mappings (gt, Ctrl-W, etc.)
│   ├── fs/
│   │   ├── VirtualFS.js        localStorage-backed virtual filesystem
│   │   └── defaults.js         Default example files for first launch
│   └── ui/
│       ├── App.js              Main shell: buffer/pane/tab lifecycle
│       ├── TabBar.js           Tab strip with modified indicators
│       ├── StatusLine.js       Mode badge, position, file info
│       ├── Splits.js           Binary tree split pane manager
│       └── Splash.js           Vim-style welcome screen
├── assets/
│   └── banner.svg              Project banner (Catppuccin themed)
└── dist/                       Build output (deploy this)
    ├── index.html
    └── vim.js                  Single bundled JS (~740KB)
```

### Key Patterns

| Pattern | Implementation |
|---------|----------------|
| Single-view state swapping | `view.setState()` swaps EditorState on tab switch (preserves cursor, undo) |
| Deferred state transitions | `setTimeout` + `requestAnimationFrame` prevents vim wrapper teardown during commands |
| Embedded update listeners | Every EditorState carries its own update handler for mode detection |
| Binary tree splits | Recursive tree structure with drag-to-resize dividers |
| localStorage persistence | `vfs:` prefixed keys, automatic default file population on first load |

---

## Theming

Catppuccin Mocha applied across every surface:

### Editor Chrome

| Element | Color | Hex |
|---------|-------|-----|
| Background | Base | `#1e1e2e` |
| Gutter | Mantle | `#181825` |
| Active line | Surface0 | `#313244` |
| Selection | Surface1 | `#45475a` |
| Line numbers | Overlay0 | `#6c7086` |
| Active line number | Yellow | `#f9e2af` |
| Cursor | Text | `#cdd6f4` |
| Matching bracket | Surface2 | `#585b70` |

### Syntax Highlighting

| Token | Color | Hex |
|-------|-------|-----|
| Keywords | Mauve | `#cba6f7` |
| Strings | Green | `#a6e3a1` |
| Comments | Overlay0 | `#6c7086` |
| Numbers | Peach | `#fab387` |
| Functions | Blue | `#89b4fa` |
| Types/Classes | Yellow | `#f9e2af` |
| Operators | Sky | `#89dceb` |
| Properties | Lavender | `#b4befe` |
| HTML Tags | Blue | `#89b4fa` |
| Regex | Pink | `#f5c2e7` |

### Mode Indicators

| Mode | Color | Hex |
|------|-------|-----|
| Normal | Blue | `#89b4fa` |
| Insert | Green | `#a6e3a1` |
| Visual | Mauve | `#cba6f7` |
| Replace | Red | `#f38ba8` |

---

## Deployment

### GitHub Pages

```bash
npm run build
# Push dist/ to gh-pages branch, or configure Pages to serve from dist/
```

### GitLab Pages

```yaml
pages:
  stage: deploy
  script:
    - npm ci && npm run build
    - mv dist public
  artifacts:
    paths: [public]
```

### Any Static Host

```bash
npm run build
# Upload dist/index.html and dist/vim.js to any web server or CDN
```

The `dist/` directory is fully self-contained. No server-side logic required.

---

<div align="center">

**Ripple** -- keystrokes ripple through the buffer.

</div>
