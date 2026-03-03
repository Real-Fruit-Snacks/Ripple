import { mocha } from '../theme.js';

export class TabBar {
  constructor(onSelect, onClose) {
    this.onSelect = onSelect;
    this.onClose = onClose;
    this.el = document.createElement('div');
    this.el.className = 'tab-bar';
    this._injectStyles();
  }

  _injectStyles() {
    if (document.getElementById('tab-bar-styles')) return;
    const style = document.createElement('style');
    style.id = 'tab-bar-styles';
    style.textContent = `
      .tab-bar {
        display: flex;
        background: ${mocha.mantle};
        height: 32px;
        flex-shrink: 0;
        overflow-x: auto;
        overflow-y: hidden;
        user-select: none;
        scrollbar-width: none;
      }
      .tab-bar::-webkit-scrollbar { display: none; }
      .tab-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 14px;
        height: 32px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: ${mocha.overlay1};
        background: ${mocha.surface0};
        border-right: 1px solid ${mocha.mantle};
        cursor: pointer;
        white-space: nowrap;
        flex-shrink: 0;
        transition: background 0.1s, color 0.1s;
      }
      .tab-item:hover {
        background: ${mocha.surface1};
        color: ${mocha.text};
      }
      .tab-item.active {
        background: ${mocha.base};
        color: ${mocha.text};
        border-bottom: 2px solid ${mocha.blue};
      }
      .tab-modified {
        color: ${mocha.peach};
        font-size: 14px;
        line-height: 1;
      }
      .tab-close {
        display: none;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 2px;
        font-size: 14px;
        line-height: 1;
        color: ${mocha.overlay0};
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        font-family: 'JetBrains Mono', monospace;
      }
      .tab-item:hover .tab-close { display: flex; }
      .tab-close:hover {
        background: ${mocha.surface2};
        color: ${mocha.text};
      }
    `;
    document.head.appendChild(style);
  }

  update(tabs, activeId) {
    this.el.innerHTML = '';
    for (const tab of tabs) {
      const item = document.createElement('div');
      item.className = 'tab-item' + (tab.id === activeId ? ' active' : '');
      item.dataset.id = tab.id;

      const name = document.createElement('span');
      name.textContent = tab.name || '[No Name]';
      item.appendChild(name);

      if (tab.modified) {
        const mod = document.createElement('span');
        mod.className = 'tab-modified';
        mod.textContent = '\u25CF';
        item.appendChild(mod);
      }

      const close = document.createElement('button');
      close.className = 'tab-close';
      close.textContent = '\u00D7';
      close.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onClose(tab.id);
      });
      item.appendChild(close);

      item.addEventListener('click', () => this.onSelect(tab.id));
      this.el.appendChild(item);
    }
  }
}
