<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Ripple/main/docs/assets/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Ripple/main/docs/assets/logo-light.svg">
  <img alt="Ripple" src="https://raw.githubusercontent.com/Real-Fruit-Snacks/Ripple/main/docs/assets/logo-dark.svg" width="520">
</picture>

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Platform](https://img.shields.io/badge/platform-Browser-lightgrey)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Browser-based Vim editor powered by CodeMirror 6**

Full Vim keybindings in a zero-dependency static site. Catppuccin Mocha theme, split panes, tabs,
virtual filesystem. No server required -- deploy anywhere that serves HTML. Ships as a single
HTML + JS bundle with no external requests, no frameworks, and no runtime dependencies.

</div>

---

## Quick Start

### Build

Prerequisites: Node.js 18+.

```bash
git clone https://github.com/Real-Fruit-Snacks/Ripple.git
cd Ripple

npm install
npm run build       # production build (minified)
npm run dev         # development build with watch + live server
```

Output is placed in `dist/`. Open `dist/index.html` in any browser.

### Deploy

The `dist/` directory is fully self-contained. Upload to any static host:

```bash
# GitHub Pages, GitLab Pages, S3, nginx, or any static host
# Just upload dist/index.html and dist/vim.js
# Or open dist/index.html directly from a file:// URI
```

### Verify

```bash
ls -la dist/            # check build output
npx eslint src/         # lint source
```

---

## Features

### Full Vim Mode

Insert, Normal, Visual, and Replace modes with motions, operators, text objects, registers, macros, and `.` repeat. Powered by `@replit/codemirror-vim` -- the most complete Vim implementation for the browser.

```
Movement:     h j k l w b e 0 $ gg G { } %
Editing:      i a I A o O r R x dd D yy p P
Operators:    d c y > < = (combined with motions/text objects)
Text Objects: iw aw i" a" i( a( i{ a{
Visual:       v V Ctrl-V
Search:       / ? n N * #
Undo/Redo:    u Ctrl-R
Repeat:       .
```

### Split Panes

Horizontal and vertical splits with drag-to-resize dividers. `Ctrl-W h/j/k/l` spatial navigation. Multiple views of the same buffer with independent cursors. Close splits individually or keep only the focused pane.

```
Ctrl-W s         →  horizontal split
Ctrl-W v         →  vertical split
Ctrl-W h/j/k/l  →  navigate between splits
Ctrl-W c         →  close current split
Ctrl-W o         →  close all other splits
:split [file]    →  horizontal split (ex command)
:vsplit [file]   →  vertical split (ex command)
```

### Tab System

Tab bar with modified indicators, click-to-switch, and close buttons. `gt`/`gT` for tab cycling. Modified buffers are protected from accidental close.

```
:tabnew [file]   →  open file in new tab
:tabnext         →  next tab (or gt)
:tabprevious     →  previous tab (or gT)
:tabclose        →  close current tab
```

### Virtual Filesystem

localStorage-backed file persistence across sessions. Seven example files ship by default covering JavaScript, HTML, CSS, Python, Markdown, and JSON. Standard `:w`/`:e` workflow with files surviving page refresh.

```
:w [file]        →  save buffer
:e <file>        →  open file
:saveas <file>   →  save as new filename
:enew            →  new empty buffer
:rm <file>       →  delete file from filesystem
:files           →  list all files
:ls              →  list open buffers
```

### Syntax Highlighting

JavaScript, TypeScript, JSX, TSX, HTML, CSS, Python, Markdown, and JSON. Language detection by file extension. Powered by CodeMirror's Lezer parser system for accurate, incremental highlighting.

```javascript
// Catppuccin Mocha syntax colors
Keywords    → Mauve   #cba6f7
Strings     → Green   #a6e3a1
Comments    → Overlay #6c7086
Numbers     → Peach   #fab387
Functions   → Blue    #89b4fa
Types       → Yellow  #f9e2af
Operators   → Sky     #89dceb
Properties  → Lavender #b4befe
```

### Catppuccin Mocha Theme

Complete theming across every surface -- editor chrome, status line, tab bar, and splash screen. 35+ token-to-color mappings for syntax highlighting. Mode indicator color-coded by state.

```
Normal  → Blue   #89b4fa
Insert  → Green  #a6e3a1
Visual  → Mauve  #cba6f7
Replace → Red    #f38ba8
```

### Zero Dependencies at Runtime

Single `vim.js` bundle (~740KB) produced by esbuild. No CDN, no fetch, no WebSocket, no server. Open `index.html` from a `file://` URI and everything works. Deploy to GitHub Pages, GitLab Pages, S3, or any static host.

### Vim-Style Status Line

Mode badge color-coded by state. Current filename with modified flag. Line:column position, file percentage, and filetype indicator. Command feedback displayed inline.

### Batch Operations

```
:wa     →  write all modified buffers
:qa     →  quit all (warns on unsaved)
:qa!    →  force quit all
:wqa    →  write all and quit all
:help   →  open built-in help buffer
```

---

## Architecture

```
Ripple/
├── src/
│   ├── main.js            # Bootstrap, init app, register commands
│   ├── editor.js          # CodeMirror EditorState/EditorView factory
│   ├── theme.js           # Catppuccin Mocha palette + highlight rules
│   ├── languages.js       # Language detection and loading
│   ├── commands.js        # Ex command definitions (:w, :e, :q, etc.)
│   ├── keymaps.js         # Vim action mappings (gt, Ctrl-W, etc.)
│   ├── fs/                # Virtual filesystem (localStorage-backed)
│   │   ├── VirtualFS.js
│   │   └── defaults.js    # Default example files
│   └── ui/                # UI components
│       ├── App.js         # Main shell and lifecycle
│       ├── TabBar.js      # Tab strip with modified indicators
│       ├── StatusLine.js  # Mode badge, position, file info
│       ├── Splits.js      # Binary tree split pane manager
│       └── Splash.js      # Vim-style welcome screen
├── public/
│   └── index.html         # HTML shell (inline critical CSS)
├── build.js               # esbuild script
└── dist/                  # Build output (deploy this)
    ├── index.html
    └── vim.js             # Single bundled JS (~740KB)
```

Pure JavaScript with CodeMirror 6 for the editor core and `@replit/codemirror-vim` for Vim emulation. esbuild produces a single minified bundle. The UI is vanilla DOM manipulation with no framework -- just direct DOM APIs for maximum performance and zero overhead.

---

## Platform Support

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

## License

[MIT](LICENSE) — Copyright 2026 Real-Fruit-Snacks
