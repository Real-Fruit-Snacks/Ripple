<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Ripple/main/docs/assets/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Ripple/main/docs/assets/logo-light.svg">
  <img alt="Ripple" src="https://raw.githubusercontent.com/Real-Fruit-Snacks/Ripple/main/docs/assets/logo-dark.svg" width="520">
</picture>

![JavaScript](https://img.shields.io/badge/language-JavaScript-f9e2af.svg)
![Platform](https://img.shields.io/badge/platform-Browser-lightgrey)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Browser-based Vim editor powered by CodeMirror 6**

Full Vim keybindings in a zero-dependency static site. Catppuccin Mocha theme, split panes, tabs, virtual filesystem. No server required — deploy anywhere that serves HTML. Ships as a single HTML + JS bundle with no external requests, no frameworks, and no runtime dependencies.

[Quick Start](#quick-start) • [Commands](#commands) • [Keybindings](#keybindings) • [Virtual Filesystem](#virtual-filesystem) • [Architecture](#architecture) • [Theming](#theming)

</div>

---

## Highlights

<table>
<tr>
<td width="50%">

**Full Vim Mode**
Insert, Normal, Visual, Replace modes with motions, operators, text objects, registers, macros, and `.` repeat. Powered by `@replit/codemirror-vim` — the most complete Vim implementation for the browser.

**Split Panes**
Horizontal and vertical splits with drag-to-resize dividers. `Ctrl-W h/j/k/l` spatial navigation. Multiple views of the same buffer with independent cursors. Close splits individually or keep only the focused pane.

**Virtual Filesystem**
localStorage-backed file persistence across sessions. Seven example files ship by default (JS, HTML, CSS, Python, Markdown, JSON). Standard `:w`/`:e` workflow. Files survive page refresh.

**Syntax Highlighting**
JavaScript, TypeScript, JSX, TSX, HTML, CSS, Python, Markdown, and JSON. Language detection by file extension. Powered by CodeMirror's Lezer parser system for accurate, incremental highlighting.

</td>
<td width="50%">

**Catppuccin Mocha**
Complete syntax highlighting with 35+ token-to-color mappings. Editor chrome, status line, tab bar, and splash screen all themed. Dark mode only, because that's the way.

**Tab System**
Tab bar with modified indicators, click-to-switch, close buttons. `gt`/`gT` cycling. `:tabnew`, `:tabnext`, `:tabprev`, `:tabclose`. Modified buffers are protected from accidental close.

**Zero Dependencies**
Single `vim.js` bundle (~740KB) produced by esbuild. No CDN, no fetch, no WebSocket, no server. Open `index.html` from a file URI and everything works. Deploy to GitHub Pages, GitLab Pages, S3, or any static host.

**Vim-Style Status Line**
Mode badge color-coded by state (Normal/Insert/Visual/Replace). Current filename with modified flag. Line:column position, file percentage, and filetype indicator. Command feedback displayed inline.

</td>
</tr>
</table>

---

## Quick Start

### Prerequisites

<table>
<tr>
<th>Requirement</th>
<th>Version</th>
<th>Purpose</th>
</tr>
<tr>
<td>Node.js</td>
<td>18+</td>
<td>Build toolchain</td>
</tr>
<tr>
<td>npm</td>
<td>9+</td>
<td>Package management</td>
</tr>
</table>

### Build

```bash
# Clone repository
git clone https://github.com/Real-Fruit-Snacks/Ripple.git
cd Ripple

# Install dependencies
npm install

# Production build (minified)
npm run build

# Development build with watch + live server
npm run dev
```

Output is placed in `dist/`. Open `dist/index.html` in any browser.

### Verification

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

## Architecture

```
Ripple/
├── build.js                          # esbuild script (watch/serve modes)
├── eslint.config.js                  # ESLint v9 flat config
├── package.json                      # Dependencies and scripts
│
├── src/
│   ├── main.js                       # Bootstrap: init app, register commands
│   ├── editor.js                     # CodeMirror EditorState/EditorView factory
│   ├── theme.js                      # Catppuccin Mocha palette + highlight rules
│   ├── languages.js                  # Language detection and loading
│   ├── commands.js                   # Ex command definitions (:w, :e, :q, etc.)
│   ├── keymaps.js                    # Vim action mappings (gt, Ctrl-W, etc.)
│   │
│   ├── fs/                           # ── Virtual Filesystem ──
│   │   ├── VirtualFS.js              # localStorage-backed virtual filesystem
│   │   └── defaults.js               # Default example files for first launch
│   │
│   └── ui/                           # ── User Interface ──
│       ├── App.js                    # Main shell: buffer/pane/tab lifecycle
│       ├── TabBar.js                 # Tab strip with modified indicators
│       ├── StatusLine.js             # Mode badge, position, file info
│       ├── Splits.js                 # Binary tree split pane manager
│       └── Splash.js                 # Vim-style welcome screen
│
├── public/                           # ── Static Shell ──
│   └── index.html                    # HTML shell (inline critical CSS)
│
├── assets/                           # ── Repository Assets ──
│   └── banner.svg                    # Project banner (Catppuccin themed)
│
├── docs/                             # ── GitHub Pages ──
│   ├── index.html                    # Project website
│   └── assets/
│       ├── logo-dark.svg             # Logo for dark theme
│       └── logo-light.svg            # Logo for light theme
│
└── dist/                             # ── Build Output (deploy this) ──
    ├── index.html
    └── vim.js                        # Single bundled JS (~740KB)
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

## Platform Support

<table>
<tr>
<th>Capability</th>
<th>Chrome</th>
<th>Firefox</th>
<th>Safari</th>
<th>Edge</th>
</tr>
<tr>
<td>Vim Keybindings</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
</tr>
<tr>
<td>Split Panes</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
</tr>
<tr>
<td>Tab System</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
</tr>
<tr>
<td>Virtual Filesystem</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
</tr>
<tr>
<td>Syntax Highlighting</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
</tr>
<tr>
<td>Catppuccin Theme</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
<td>Full</td>
</tr>
<tr>
<td>File URI Loading</td>
<td>Full</td>
<td>Full</td>
<td>Limited</td>
<td>Full</td>
</tr>
</table>

---

## Security

### Vulnerability Reporting

**Report security issues via:**
- GitHub Security Advisories (preferred)
- Private disclosure to maintainers
- Responsible disclosure timeline (90 days)

**Do NOT:**
- Open public GitHub issues for vulnerabilities
- Disclose before coordination with maintainers

---

## License

MIT License

Copyright &copy; 2026 Real-Fruit-Snacks

```
THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.
THE AUTHORS ARE NOT LIABLE FOR ANY DAMAGES ARISING FROM USE.
```

---

## Resources

- **GitHub**: [github.com/Real-Fruit-Snacks/Ripple](https://github.com/Real-Fruit-Snacks/Ripple)
- **Issues**: [Report a Bug](https://github.com/Real-Fruit-Snacks/Ripple/issues)
- **Security**: [SECURITY.md](SECURITY.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

<div align="center">

**Part of the Real-Fruit-Snacks water-themed security toolkit**

[Aquifer](https://github.com/Real-Fruit-Snacks/Aquifer) • [armsforge](https://github.com/Real-Fruit-Snacks/armsforge) • [Cascade](https://github.com/Real-Fruit-Snacks/Cascade) • [Conduit](https://github.com/Real-Fruit-Snacks/Conduit) • [Deadwater](https://github.com/Real-Fruit-Snacks/Deadwater) • [Deluge](https://github.com/Real-Fruit-Snacks/Deluge) • [Depth](https://github.com/Real-Fruit-Snacks/Depth) • [Dew](https://github.com/Real-Fruit-Snacks/Dew) • [Droplet](https://github.com/Real-Fruit-Snacks/Droplet) • [Fathom](https://github.com/Real-Fruit-Snacks/Fathom) • [Flux](https://github.com/Real-Fruit-Snacks/Flux) • [Grotto](https://github.com/Real-Fruit-Snacks/Grotto) • [HydroShot](https://github.com/Real-Fruit-Snacks/HydroShot) • [LigoloSupport](https://github.com/Real-Fruit-Snacks/LigoloSupport) • [Maelstrom](https://github.com/Real-Fruit-Snacks/Maelstrom) • [Rapids](https://github.com/Real-Fruit-Snacks/Rapids) • **Ripple** • [Riptide](https://github.com/Real-Fruit-Snacks/Riptide) • [Runoff](https://github.com/Real-Fruit-Snacks/Runoff) • [Seep](https://github.com/Real-Fruit-Snacks/Seep) • [Shallows](https://github.com/Real-Fruit-Snacks/Shallows) • [Siphon](https://github.com/Real-Fruit-Snacks/Siphon) • [Slipstream](https://github.com/Real-Fruit-Snacks/Slipstream) • [Spillway](https://github.com/Real-Fruit-Snacks/Spillway) • [Sunken-Archive](https://github.com/Real-Fruit-Snacks/Sunken-Archive) • [Surge](https://github.com/Real-Fruit-Snacks/Surge) • [Tidemark](https://github.com/Real-Fruit-Snacks/Tidemark) • [Tidepool](https://github.com/Real-Fruit-Snacks/Tidepool) • [Undercurrent](https://github.com/Real-Fruit-Snacks/Undercurrent) • [Undertow](https://github.com/Real-Fruit-Snacks/Undertow) • [Vapor](https://github.com/Real-Fruit-Snacks/Vapor) • [Wellspring](https://github.com/Real-Fruit-Snacks/Wellspring) • [Whirlpool](https://github.com/Real-Fruit-Snacks/Whirlpool)

*Remember: With great power comes great responsibility.*

</div>
