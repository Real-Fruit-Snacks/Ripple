import { getCM } from '@replit/codemirror-vim';
import { createEditorState, createEditorView } from '../editor.js';
import { vfs } from '../fs/VirtualFS.js';
import { TabBar } from './TabBar.js';
import { StatusLine } from './StatusLine.js';
import { SplitManager } from './Splits.js';
import { Splash } from './Splash.js';

let nextBufferId = 1;

export class App {
  constructor(root) {
    this.root = root;
    this.buffers = new Map();    // id -> { id, name, state, modified, savedContent }
    this.paneBuffers = new Map(); // paneId -> bufferId
    this.paneViews = new Map();   // paneId -> EditorView
    this.activeBufferId = null;
    this.activePaneId = null;
    this._lastMode = 'normal';

    // Create UI
    this.tabBar = new TabBar(
      (id) => this.switchToBuffer(id),
      (id) => {
        const buf = this.buffers.get(id);
        if (buf && buf.modified) {
          // Switch to the buffer so the user can see it, then warn
          this.switchToBuffer(id);
          return; // Don't close modified buffer from tab bar
        }
        this.closeBuffer(id);
      },
    );
    this.statusLine = new StatusLine();
    this.splits = new SplitManager((paneId) => this._onPaneFocus(paneId));

    // Layout
    root.appendChild(this.tabBar.el);
    root.appendChild(this.splits.el);
    root.appendChild(this.statusLine.el);
  }

  // Show splash screen, then open welcome file on dismiss
  showSplash() {
    const splash = new Splash(() => {
      this.openFile('welcome.txt');
    });
    splash.mount(this.splits.el);
  }

  openFile(filename) {
    // Check if already open
    for (const [id, buf] of this.buffers) {
      if (buf.name === filename) {
        this.switchToBuffer(id);
        return id;
      }
    }

    const content = vfs.exists(filename) ? vfs.readFile(filename) : '';
    return this._createBuffer(filename, content);
  }

  openNew(filename, content = '') {
    return this._createBuffer(filename || '', content);
  }

  // Shared update handler — embedded in every EditorState
  _makeUpdateHandler() {
    const self = this;
    return (update) => {
      // Find which pane this view belongs to
      let paneId = null;
      for (const [pid, view] of self.paneViews) {
        if (view === update.view) { paneId = pid; break; }
      }
      if (!paneId) return;

      const bufId = self.paneBuffers.get(paneId);
      const buf = bufId ? self.buffers.get(bufId) : null;

      if (update.docChanged && buf) {
        const content = update.state.doc.toString();
        buf.modified = content !== buf.savedContent;
        buf.state = update.state;
        self._updateTabBar();
        self._updateStatusLine();
      }

      if (update.docChanged || update.transactions.length > 0) {
        self._updateStatusLine();
      }

      // Detect vim mode changes
      if (self.activePaneId === paneId) {
        const cm = getCM(update.view);
        if (cm) {
          const vimState = cm.state.vim;
          if (vimState) {
            let mode = 'normal';
            if (vimState.insertMode) mode = 'insert';
            else if (vimState.visualMode) mode = 'visual';
            else if (vimState.mode === 'replace') mode = 'replace';
            if (mode !== self._lastMode) {
              self._lastMode = mode;
              self.statusLine.setMode(mode);
            }
          }
        }
      }
    };
  }

  _createBuffer(name, content) {
    const id = nextBufferId++;
    const state = createEditorState(content, name, this._makeUpdateHandler());

    this.buffers.set(id, {
      id,
      name,
      state,
      modified: false,
      savedContent: content,
    });

    if (this.activePaneId && this.paneViews.has(this.activePaneId)) {
      // Swap state in current pane — _setPaneBuffer handles focus after
      // deferred setState, so don't call _focusActiveView here.
      this._setPaneBuffer(this.activePaneId, id);
    } else {
      // First buffer: create initial pane
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;flex:1;overflow:hidden;';
      const view = createEditorView(wrapper, state);
      const paneId = this.splits.init(wrapper);
      this.paneViews.set(paneId, view);
      this.paneBuffers.set(paneId, id);
      this.activePaneId = paneId;
      this._focusActiveView();
    }

    this.activeBufferId = id;
    this._updateTabBar();
    this._updateStatusLine();
    return id;
  }

  _setPaneBuffer(paneId, bufferId) {
    const view = this.paneViews.get(paneId);
    if (!view) return;

    // Save current state
    const oldBufId = this.paneBuffers.get(paneId);
    if (oldBufId && this.buffers.has(oldBufId)) {
      this.buffers.get(oldBufId).state = view.state;
    }

    // Swap in new state
    const buf = this.buffers.get(bufferId);
    if (!buf) return;

    this.paneBuffers.set(paneId, bufferId);
    this.activeBufferId = bufferId;

    // Defer setState to avoid destroying the vim CM5 wrapper while a
    // vim command dialog is still closing (causes "vim2 is null" error).
    // Use rAF after setState so vim's CM5 wrapper is fully initialized
    // before we attempt to focus.
    setTimeout(() => {
      view.setState(buf.state);
      requestAnimationFrame(() => {
        view.focus();
        this._updateStatusLine();
      });
    }, 0);
  }

  switchToBuffer(id) {
    if (!this.buffers.has(id)) return;
    this._setPaneBuffer(this.activePaneId, id);
    this._updateTabBar();
    // Don't call _focusActiveView here — _setPaneBuffer handles focus
    // after the deferred setState completes.
  }

  nextTab() {
    const ids = [...this.buffers.keys()];
    if (ids.length <= 1) return;
    const idx = ids.indexOf(this.activeBufferId);
    this.switchToBuffer(ids[(idx + 1) % ids.length]);
  }

  prevTab() {
    const ids = [...this.buffers.keys()];
    if (ids.length <= 1) return;
    const idx = ids.indexOf(this.activeBufferId);
    this.switchToBuffer(ids[(idx - 1 + ids.length) % ids.length]);
  }

  closeBuffer(id) {
    if (!this.buffers.has(id)) return;

    if (this.buffers.size === 1) {
      // Last buffer: re-show splash
      this.buffers.delete(id);
      this._createBuffer('', '');
      this.showSplash();
      return;
    }

    // Switch to another buffer first
    const ids = [...this.buffers.keys()];
    const idx = ids.indexOf(id);
    const nextId = ids[idx === ids.length - 1 ? idx - 1 : idx + 1];

    if (this.activeBufferId === id) {
      this.switchToBuffer(nextId);
    }

    // Update any panes showing this buffer
    for (const [paneId, bufId] of this.paneBuffers) {
      if (bufId === id) {
        this._setPaneBuffer(paneId, nextId);
      }
    }

    this.buffers.delete(id);
    this._updateTabBar();
    this._updateStatusLine();
  }

  saveBuffer(id, newName) {
    const buf = this.buffers.get(id || this.activeBufferId);
    if (!buf) return false;

    if (newName) buf.name = newName;
    if (!buf.name) return false;

    // Sync current state from view
    const view = this.paneViews.get(this.activePaneId);
    if (view && this.paneBuffers.get(this.activePaneId) === buf.id) {
      buf.state = view.state;
    }

    const content = buf.state.doc.toString();
    vfs.writeFile(buf.name, content);
    buf.savedContent = content;
    buf.modified = false;
    this._updateTabBar();
    this._updateStatusLine();
    return true;
  }

  splitPane(direction, filename) {
    // Determine which buffer to show in the new split
    let bufId;
    if (filename) {
      // Check if already open
      for (const [id, buf] of this.buffers) {
        if (buf.name === filename) { bufId = id; break; }
      }
      // If not open, create buffer without touching the current pane
      if (!bufId) {
        const content = vfs.exists(filename) ? vfs.readFile(filename) : '';
        const id = nextBufferId++;
        const state = createEditorState(content, filename, this._makeUpdateHandler());
        this.buffers.set(id, {
          id, name: filename, state, modified: false, savedContent: content,
        });
        bufId = id;
        this._updateTabBar();
      }
    } else {
      bufId = this.activeBufferId;
    }

    const buf = this.buffers.get(bufId);
    if (!buf) return;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex:1;overflow:hidden;';
    // Create a fresh state for the split (shares content, independent cursor)
    const splitState = createEditorState(
      buf.state.doc.toString(), buf.name, this._makeUpdateHandler()
    );
    const view = createEditorView(wrapper, splitState);

    const paneId = this.splits.split(direction, wrapper);
    if (!paneId) return;

    this.paneViews.set(paneId, view);
    this.paneBuffers.set(paneId, bufId);
    this.activePaneId = paneId;
    this.activeBufferId = bufId;
    this._updateStatusLine();
    this._focusActiveView();
  }

  closePane() {
    if (this.splits.getAllPaneIds().length <= 1) {
      this.closeBuffer(this.activeBufferId);
      return;
    }

    const paneId = this.activePaneId;
    const view = this.paneViews.get(paneId);
    if (view) view.destroy();
    this.paneViews.delete(paneId);
    this.paneBuffers.delete(paneId);
    this.splits.close(paneId);
  }

  closeOtherPanes() {
    const keepPaneId = this.activePaneId;
    for (const paneId of this.splits.getAllPaneIds()) {
      if (paneId !== keepPaneId) {
        const view = this.paneViews.get(paneId);
        if (view) view.destroy();
        this.paneViews.delete(paneId);
        this.paneBuffers.delete(paneId);
      }
    }
    this.splits.closeOthers();
  }

  navigateSplit(dir) {
    this.splits.navigate(dir);
  }

  getActiveView() {
    return this.paneViews.get(this.activePaneId);
  }

  getActiveBuffer() {
    return this.buffers.get(this.activeBufferId);
  }

  listBuffers() {
    return [...this.buffers.values()].map(b => ({
      id: b.id,
      name: b.name || '[No Name]',
      active: b.id === this.activeBufferId,
      modified: b.modified,
    }));
  }

  _onPaneFocus(paneId) {
    this.activePaneId = paneId;
    const bufId = this.paneBuffers.get(paneId);
    if (bufId) {
      this.activeBufferId = bufId;
      this._updateTabBar();
      this._updateStatusLine();
    }
  }

  _focusActiveView() {
    const view = this.paneViews.get(this.activePaneId);
    if (view) {
      requestAnimationFrame(() => view.focus());
    }
  }

  _updateTabBar() {
    const tabs = [...this.buffers.values()].map(b => ({
      id: b.id,
      name: b.name || '[No Name]',
      modified: b.modified,
    }));
    this.tabBar.update(tabs, this.activeBufferId);
  }

  _updateStatusLine() {
    const buf = this.buffers.get(this.activeBufferId);
    if (!buf) return;

    this.statusLine.setFile(buf.name, buf.modified);

    const view = this.paneViews.get(this.activePaneId);
    if (view) {
      const pos = view.state.selection.main.head;
      const line = view.state.doc.lineAt(pos);
      const col = pos - line.from + 1;
      this.statusLine.setPosition(line.number, col, view.state.doc.lines);
    }
  }
}
