import { mocha } from '../theme.js';
import { getFileType } from '../languages.js';

const modeColors = {
  normal:  mocha.blue,
  insert:  mocha.green,
  visual:  mocha.mauve,
  replace: mocha.red,
  command: mocha.yellow,
};

export class StatusLine {
  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'status-line';
    this.el.innerHTML = `
      <div class="status-left">
        <span class="status-mode">NORMAL</span>
        <span class="status-file">
          <span class="status-filename">[No Name]</span>
          <span class="status-modified"></span>
        </span>
      </div>
      <div class="status-right">
        <span class="status-filetype">text</span>
        <span class="status-position">1:1</span>
        <span class="status-percent">Top</span>
      </div>
    `;
    this._injectStyles();

    this.modeEl = this.el.querySelector('.status-mode');
    this.filenameEl = this.el.querySelector('.status-filename');
    this.modifiedEl = this.el.querySelector('.status-modified');
    this.filetypeEl = this.el.querySelector('.status-filetype');
    this.positionEl = this.el.querySelector('.status-position');
    this.percentEl = this.el.querySelector('.status-percent');

    this._mode = 'normal';
    this._msgTimer = null;
    this._msgPanel = null;
    this.setMode('normal');
  }

  _injectStyles() {
    if (document.getElementById('status-line-styles')) return;
    const style = document.createElement('style');
    style.id = 'status-line-styles';
    style.textContent = `
      .status-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 24px;
        padding: 0 12px;
        background: ${mocha.surface0};
        color: ${mocha.subtext1};
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 12px;
        flex-shrink: 0;
        user-select: none;
      }
      .status-left, .status-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .status-mode {
        font-weight: bold;
        padding: 1px 8px;
        border-radius: 2px;
        font-size: 11px;
        letter-spacing: 0.5px;
      }
      .status-modified {
        color: ${mocha.peach};
      }
      .status-filename {
        color: ${mocha.text};
      }
      .status-filetype {
        color: ${mocha.overlay1};
      }
      .status-position {
        color: ${mocha.subtext0};
      }
      .status-percent {
        color: ${mocha.overlay1};
        min-width: 36px;
        text-align: right;
      }
    `;
    document.head.appendChild(style);
  }

  setMode(mode) {
    this._mode = mode;
    const label = mode.toUpperCase();
    const color = modeColors[mode] || mocha.blue;
    this.modeEl.textContent = label;
    this.modeEl.style.background = color;
    this.modeEl.style.color = mocha.crust;
  }

  setFile(filename, modified) {
    if (this._msgTimer) return; // Don't overwrite a single-line message
    this.filenameEl.textContent = filename || '[No Name]';
    this.modifiedEl.textContent = modified ? '[+]' : '';
    this.filetypeEl.textContent = getFileType(filename);
    document.title = filename ? `${filename} - Ripple` : 'Ripple';
  }

  showMessage(msg, duration = 5000) {
    this._clearMessage();
    const lines = msg.split('\n');
    if (lines.length <= 1) {
      // Single-line: show in the filename area
      this.filenameEl.textContent = msg;
      this.modifiedEl.textContent = '';
      this._msgTimer = setTimeout(() => this._clearMessage(), duration);
    } else {
      // Multi-line: show panel above status line, dismiss on keypress
      const panel = document.createElement('div');
      panel.className = 'status-msg-panel';
      panel.style.cssText = `
        position: absolute; bottom: 24px; left: 0; right: 0;
        background: ${mocha.mantle}; color: ${mocha.text};
        font-family: 'JetBrains Mono', monospace; font-size: 13px;
        padding: 4px 12px; white-space: pre; z-index: 50;
        border-top: 1px solid ${mocha.surface0};
        max-height: 50vh; overflow-y: auto;
      `;
      panel.textContent = msg;
      this.el.parentElement.appendChild(panel);
      this._msgPanel = panel;
      this._msgDismiss = () => {
        this._clearMessage();
      };
      // Dismiss on next keypress
      setTimeout(() => {
        document.addEventListener('keydown', this._msgDismiss, { once: true });
      }, 50);
    }
  }

  _clearMessage() {
    if (this._msgTimer) {
      clearTimeout(this._msgTimer);
      this._msgTimer = null;
    }
    if (this._msgPanel) {
      this._msgPanel.remove();
      this._msgPanel = null;
    }
    if (this._msgDismiss) {
      document.removeEventListener('keydown', this._msgDismiss);
      this._msgDismiss = null;
    }
  }

  setPosition(line, col, totalLines) {
    this.positionEl.textContent = `${line}:${col}`;
    if (totalLines <= 1) {
      this.percentEl.textContent = 'All';
    } else if (line === 1) {
      this.percentEl.textContent = 'Top';
    } else if (line === totalLines) {
      this.percentEl.textContent = 'Bot';
    } else {
      const pct = Math.round(((line - 1) / (totalLines - 1)) * 100);
      this.percentEl.textContent = `${pct}%`;
    }
  }
}
