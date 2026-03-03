import { mocha } from '../theme.js';

export class Splash {
  constructor(onDismiss) {
    this.onDismiss = onDismiss;
    this.el = document.createElement('div');
    this.el.className = 'splash-screen';
    this._dismissed = false;
    this._build();
    this._injectStyles();
    this._handler = (e) => {
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
      this.dismiss(e);
    };
    document.addEventListener('keydown', this._handler);
    this.el.addEventListener('click', () => this.dismiss(null));
  }

  _injectStyles() {
    if (document.getElementById('splash-styles')) return;
    const style = document.createElement('style');
    style.id = 'splash-styles';
    style.textContent = `
      .splash-screen {
        position: absolute;
        inset: 0;
        background: ${mocha.base};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        z-index: 100;
        cursor: default;
      }
      .splash-tildes {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        display: flex;
        flex-direction: column;
        padding-left: 16px;
        pointer-events: none;
      }
      .splash-tilde {
        color: ${mocha.blue};
        font-size: 14px;
        line-height: 21px;
        height: 21px;
      }
      .splash-center {
        position: relative;
        z-index: 1;
        text-align: center;
        line-height: 1.6;
      }
      .splash-title {
        color: ${mocha.blue};
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 4px;
      }
      .splash-version {
        color: ${mocha.subtext0};
        font-size: 13px;
        margin-bottom: 16px;
      }
      .splash-info {
        color: ${mocha.overlay1};
        font-size: 13px;
      }
      .splash-info .key {
        color: ${mocha.text};
      }
      .splash-info .cmd {
        color: ${mocha.yellow};
      }
      .splash-tagline {
        color: ${mocha.overlay0};
        font-size: 12px;
        margin-top: 16px;
      }
    `;
    document.head.appendChild(style);
  }

  _build() {
    const tildes = document.createElement('div');
    tildes.className = 'splash-tildes';
    this._tildesEl = tildes;
    this.el.appendChild(tildes);

    const center = document.createElement('div');
    center.className = 'splash-center';
    center.innerHTML = `
      <div class="splash-title">RIPPLE</div>
      <div class="splash-version">Vim in the Browser</div>
      <div class="splash-info">
        <div>type <span class="cmd">:e &lt;file&gt;</span> to open a file</div>
        <div>type <span class="cmd">:help</span> for help</div>
        <div>type <span class="cmd">:ls</span> to list buffers</div>
        <div>type <span class="cmd">:files</span> to list all files</div>
        <div>type <span class="cmd">:q</span> to exit</div>
      </div>
      <div class="splash-tagline">Powered by CodeMirror 6 &middot; Catppuccin Mocha</div>
    `;
    this.el.appendChild(center);
  }

  mount(parent) {
    parent.appendChild(this.el);
    this._fillTildes();
    this._resizeObserver = new ResizeObserver(() => this._fillTildes());
    this._resizeObserver.observe(this.el);
  }

  _fillTildes() {
    const h = this.el.clientHeight;
    const lineH = 21;
    const count = Math.floor(h / lineH);
    this._tildesEl.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const line = document.createElement('div');
      line.className = 'splash-tilde';
      line.textContent = '~';
      this._tildesEl.appendChild(line);
    }
  }

  dismiss(originalEvent) {
    if (this._dismissed) return;
    this._dismissed = true;
    document.removeEventListener('keydown', this._handler);
    if (this._resizeObserver) this._resizeObserver.disconnect();
    this.el.remove();
    this.onDismiss();

    // Replay the triggering keypress into the now-focused editor
    if (originalEvent && originalEvent.key) {
      setTimeout(() => {
        const target = document.querySelector('.cm-content');
        if (target) {
          target.dispatchEvent(new KeyboardEvent('keydown', {
            key: originalEvent.key,
            code: originalEvent.code,
            keyCode: originalEvent.keyCode,
            which: originalEvent.which,
            bubbles: true,
            cancelable: true,
          }));
        }
      }, 10);
    }
  }
}
