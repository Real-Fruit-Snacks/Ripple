import { Vim } from '@replit/codemirror-vim';
import { vfs } from './fs/VirtualFS.js';

const helpText = `
Ripple - Help
=============

NAVIGATION
  h/j/k/l         Move left/down/up/right
  w/b/e           Word forward/back/end
  0/$             Line start/end
  gg/G            File start/end
  {/}             Paragraph up/down
  Ctrl-D/Ctrl-U   Half page down/up
  %               Matching bracket

EDITING
  i/a             Insert before/after cursor
  I/A             Insert at line start/end
  o/O             New line below/above
  r               Replace character
  R               Replace mode
  x               Delete character
  dd              Delete line
  D               Delete to end of line
  yy              Yank line
  p/P             Paste after/before
  u               Undo
  Ctrl-R          Redo
  .               Repeat last change

TEXT OBJECTS
  ciw/diw/yiw     Change/delete/yank inner word
  ci"/di"/yi"     Change/delete/yank inside quotes
  ci(/di(/yi(     Change/delete/yank inside parens
  ca{/da{/ya{     Change/delete/yank around braces

VISUAL MODE
  v               Character visual
  V               Line visual
  Ctrl-V          Block visual

SEARCH
  /pattern        Search forward
  ?pattern        Search backward
  n/N             Next/previous match
  */#             Search word under cursor

COMMANDS
  :w [file]       Save file (optionally with new name)
  :e <file>       Open file
  :q              Close buffer/tab
  :q!             Force close (discard changes)
  :wq             Save and close
  :tabnew [file]  Open file in new tab
  :tabnext / gt   Next tab
  :tabprev / gT   Previous tab
  :tabclose       Close current tab
  :split [file]   Horizontal split
  :vsplit [file]  Vertical split
  :close          Close split
  :only           Close other splits
  :ls / :buffers  List open buffers
  :files          List all files in filesystem
  :help           Show this help
  :set number     Toggle line numbers
  :set rnu        Toggle relative line numbers
  :new            New empty buffer
  :enew           New empty buffer in current tab
  :rm <file>      Delete file from filesystem
  :qa / :qa!      Quit all (force)
  :wa             Write all modified buffers
  :wqa            Write all and quit
  :bd / :bd!      Buffer delete (force)
  :saveas <file>  Save as new filename

SPLITS
  Ctrl-W s        Horizontal split
  Ctrl-W v        Vertical split
  Ctrl-W h/j/k/l  Navigate splits
  Ctrl-W c        Close split
  Ctrl-W o        Close other splits

TABS
  gt              Next tab
  gT              Previous tab
`.trimStart();

export function registerCommands(app) {
  _app = app;

  // :w [filename] - save
  Vim.defineEx('write', 'w', (cm, params) => {
    const name = params.args ? params.args.join(' ') : null;
    const success = app.saveBuffer(null, name);
    if (success) {
      showMessage(cm, `"${app.getActiveBuffer().name}" written`);
    } else {
      showMessage(cm, 'E32: No file name');
    }
  });

  // :e filename - edit/open file
  Vim.defineEx('edit', 'e', (cm, params) => {
    if (!params.args || !params.args.length) {
      showMessage(cm, 'E32: No file name');
      return;
    }
    const filename = params.args.join(' ');
    app.openFile(filename);
  });

  // :q - quit/close
  Vim.defineEx('quit', 'q', (cm, params) => {
    const buf = app.getActiveBuffer();
    if (buf && buf.modified && !(params.argString && params.argString.includes('!'))) {
      showMessage(cm, 'E37: No write since last change (add ! to override)');
      return;
    }
    app.closeBuffer(app.activeBufferId);
  });

  // :wq - save and quit
  Vim.defineEx('wq', 'wq', (cm, params) => {
    const name = params.args ? params.args.join(' ') : null;
    const success = app.saveBuffer(null, name);
    if (success) {
      app.closeBuffer(app.activeBufferId);
    } else {
      showMessage(cm, 'E32: No file name');
    }
  });

  // :x - save if modified, then quit
  Vim.defineEx('xit', 'x', (_cm, _params) => {
    const buf = app.getActiveBuffer();
    if (buf && buf.modified) {
      app.saveBuffer(null, null);
    }
    app.closeBuffer(app.activeBufferId);
  });

  // :tabnew [file] - new tab
  Vim.defineEx('tabnew', 'tabnew', (_cm, params) => {
    const filename = params.args ? params.args.join(' ') : '';
    if (filename && vfs.exists(filename)) {
      app.openFile(filename);
    } else {
      app.openNew(filename);
    }
  });

  // :tabnext - next tab
  Vim.defineEx('tabnext', 'tabn', () => {
    app.nextTab();
  });

  // :tabprev - previous tab
  Vim.defineEx('tabprevious', 'tabp', () => {
    app.prevTab();
  });

  // :tabclose - close tab
  Vim.defineEx('tabclose', 'tabc', () => {
    app.closeBuffer(app.activeBufferId);
  });

  // :split [file] - horizontal split
  Vim.defineEx('split', 'sp', (_cm, params) => {
    const filename = params.args ? params.args.join(' ') : null;
    app.splitPane('horizontal', filename);
  });

  // :vsplit [file] - vertical split
  Vim.defineEx('vsplit', 'vs', (_cm, params) => {
    const filename = params.args ? params.args.join(' ') : null;
    app.splitPane('vertical', filename);
  });

  // :close - close split
  Vim.defineEx('close', 'clo', () => {
    app.closePane();
  });

  // :only - close other splits
  Vim.defineEx('only', 'on', () => {
    app.closeOtherPanes();
  });

  // :ls / :buffers - list buffers
  const listBuffersHandler = (cm) => {
    const bufs = app.listBuffers();
    const lines = bufs.map(b => {
      const flags = (b.active ? '%a' : '  ') + (b.modified ? '+' : ' ');
      return `  ${b.id} ${flags} "${b.name}"`;
    });
    showMessage(cm, lines.join('\n'));
  };
  Vim.defineEx('ls', 'ls', listBuffersHandler);
  Vim.defineEx('buffers', 'buffers', listBuffersHandler);

  // :files - list all files in VFS
  Vim.defineEx('files', 'files', (cm, _params) => {
    const files = vfs.listFiles();
    if (files.length === 0) {
      showMessage(cm, 'No files');
    } else {
      showMessage(cm, files.join('\n'));
    }
  });

  // :help - show help
  Vim.defineEx('help', 'h', (_cm, _params) => {
    // Open help as a buffer
    const existing = [...app.buffers.values()].find(b => b.name === '[Help]');
    if (existing) {
      app.switchToBuffer(existing.id);
    } else {
      app.openNew('[Help]', helpText);
    }
  });

  // :new - new empty buffer
  Vim.defineEx('new', 'new', () => {
    app.splitPane('horizontal');
    app.openNew('', '');
  });

  // :enew - new empty buffer in current window
  Vim.defineEx('enew', 'ene', () => {
    app.openNew('', '');
  });

  // :rm <file> - delete file from VFS (avoids conflict with vim's :d)
  Vim.defineEx('rm', 'rm', (cm, params) => {
    if (!params.args || !params.args.length) {
      showMessage(cm, 'Usage: :rm <filename>');
      return;
    }
    const filename = params.args.join(' ');
    if (vfs.exists(filename)) {
      vfs.deleteFile(filename);
      showMessage(cm, `"${filename}" deleted`);
    } else {
      showMessage(cm, `E212: "${filename}" not found`);
    }
  });

  // :qa - quit all
  Vim.defineEx('qall', 'qa', (cm, params) => {
    const force = params.argString && params.argString.includes('!');
    if (!force && [...app.buffers.values()].some(b => b.modified)) {
      showMessage(cm, 'E37: No write since last change (add ! to override)');
      return;
    }
    while (app.buffers.size > 1) {
      app.closeBuffer([...app.buffers.keys()][0]);
    }
    app.closeBuffer([...app.buffers.keys()][0]);
  });

  // :wqa / :xa - write and quit all
  Vim.defineEx('wqall', 'wqa', (cm) => {
    for (const buf of app.buffers.values()) {
      if (buf.modified && buf.name) {
        app.saveBuffer(buf.id);
      } else if (buf.modified) {
        showMessage(cm, 'E32: No file name');
        return;
      }
    }
    while (app.buffers.size > 1) {
      app.closeBuffer([...app.buffers.keys()][0]);
    }
    app.closeBuffer([...app.buffers.keys()][0]);
  });

  // :wa - write all
  Vim.defineEx('wall', 'wa', (cm) => {
    let count = 0;
    for (const buf of app.buffers.values()) {
      if (buf.modified && buf.name) {
        app.saveBuffer(buf.id);
        count++;
      }
    }
    showMessage(cm, `${count} buffer(s) written`);
  });

  // :bd - buffer delete
  Vim.defineEx('bdelete', 'bd', (cm, params) => {
    const buf = app.getActiveBuffer();
    const force = params.argString && params.argString.includes('!');
    if (buf && buf.modified && !force) {
      showMessage(cm, 'E37: No write since last change (add ! to override)');
      return;
    }
    app.closeBuffer(app.activeBufferId);
  });

  // :saveas - save as new filename
  Vim.defineEx('saveas', 'sav', (cm, params) => {
    if (!params.args || !params.args.length) {
      showMessage(cm, 'E32: No file name');
      return;
    }
    const filename = params.args.join(' ');
    const success = app.saveBuffer(null, filename);
    if (success) {
      showMessage(cm, `"${filename}" written`);
    }
  });

  // :set number / :set nonumber
  Vim.defineEx('set', 'set', (cm, params) => {
    if (!params.args) return;
    const arg = params.args.join(' ');
    showMessage(cm, `:set ${arg}`);
  });
}

let _app = null;

function showMessage(_cm, msg) {
  if (_app && _app.statusLine) {
    _app.statusLine.showMessage(msg);
  }
}
