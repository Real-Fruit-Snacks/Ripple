import { mocha } from '../theme.js';

export class SplitManager {
  constructor(onFocus) {
    this.onFocus = onFocus;
    this.el = document.createElement('div');
    this.el.className = 'split-root';
    this.root = null;
    this._nextId = 0;
    this._injectStyles();
  }

  _injectStyles() {
    if (document.getElementById('split-styles')) return;
    const style = document.createElement('style');
    style.id = 'split-styles';
    style.textContent = `
      .split-root {
        flex: 1;
        display: flex;
        overflow: hidden;
        position: relative;
      }
      .split-container {
        display: flex;
        flex: 1;
        overflow: hidden;
      }
      .split-container.horizontal { flex-direction: column; }
      .split-container.vertical { flex-direction: row; }
      .split-pane {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        min-width: 50px;
        min-height: 50px;
      }
      .split-pane.focused {
        outline: 1px solid ${mocha.surface2};
        outline-offset: -1px;
      }
      .split-pane .cm-editor {
        flex: 1;
        height: 100%;
      }
      .split-divider {
        flex-shrink: 0;
        background: ${mocha.surface0};
        z-index: 5;
      }
      .split-divider:hover, .split-divider.dragging {
        background: ${mocha.blue};
      }
      .split-container.vertical > .split-divider {
        width: 3px;
        cursor: col-resize;
      }
      .split-container.horizontal > .split-divider {
        height: 3px;
        cursor: row-resize;
      }
    `;
    document.head.appendChild(style);
  }

  _newId() {
    return 'pane-' + (this._nextId++);
  }

  // Initialize with a single pane
  init(editorEl) {
    const id = this._newId();
    this.root = { type: 'leaf', id, el: null, editorEl };
    this._render();
    this.focusedId = id;
    return id;
  }

  // Split the focused pane
  split(direction, newEditorEl) {
    if (!this.root) return null;
    const target = this._findLeaf(this.root, this.focusedId);
    if (!target) return null;

    const newId = this._newId();
    const newLeaf = { type: 'leaf', id: newId, el: null, editorEl: newEditorEl };
    const oldLeaf = { type: 'leaf', id: target.id, el: null, editorEl: target.editorEl };

    // Replace target with a container
    target.type = 'container';
    target.direction = direction;
    target.children = [oldLeaf, newLeaf];
    target.sizes = [50, 50];
    delete target.editorEl;

    this._render();
    this.focus(newId);
    return newId;
  }

  // Close a pane
  close(id) {
    if (!this.root) return false;
    if (this.root.type === 'leaf' && this.root.id === id) return false; // Can't close last pane

    const result = this._removeLeaf(this.root, null, id);
    if (result) {
      this._render();
      // Focus the remaining pane if current focused was closed
      if (this.focusedId === id) {
        const first = this._firstLeaf(this.root);
        if (first) this.focus(first.id);
      }
    }
    return result;
  }

  // Close all panes except the focused one
  closeOthers() {
    if (!this.root) return;
    const target = this._findLeaf(this.root, this.focusedId);
    if (!target) return;
    this.root = { type: 'leaf', id: target.id, el: null, editorEl: target.editorEl };
    this._render();
    this.focus(target.id);
  }

  focus(id) {
    this.focusedId = id;
    const multiPane = this._allLeaves(this.root).length > 1;
    this.el.querySelectorAll('.split-pane').forEach(p => {
      p.classList.toggle('focused', multiPane && p.dataset.id === id);
    });
    const leaf = this._findLeaf(this.root, id);
    if (leaf && leaf.editorEl) {
      const cm = leaf.editorEl.querySelector('.cm-content');
      if (cm) cm.focus();
    }
    if (this.onFocus) this.onFocus(id);
  }

  // Navigate between panes
  navigate(direction) {
    const panes = this._allLeaves(this.root);
    if (panes.length <= 1) return;

    const currentIdx = panes.findIndex(p => p.id === this.focusedId);
    if (currentIdx === -1) return;

    const currentRect = this._getPaneRect(this.focusedId);
    if (!currentRect) return;

    let best = null;
    let bestDist = Infinity;

    for (const pane of panes) {
      if (pane.id === this.focusedId) continue;
      const rect = this._getPaneRect(pane.id);
      if (!rect) continue;

      let valid = false;
      let dist = 0;

      switch (direction) {
        case 'left':
          valid = rect.right <= currentRect.left + 5;
          dist = currentRect.left - rect.right;
          break;
        case 'right':
          valid = rect.left >= currentRect.right - 5;
          dist = rect.left - currentRect.right;
          break;
        case 'up':
          valid = rect.bottom <= currentRect.top + 5;
          dist = currentRect.top - rect.bottom;
          break;
        case 'down':
          valid = rect.top >= currentRect.bottom - 5;
          dist = rect.top - currentRect.bottom;
          break;
      }

      if (valid && dist < bestDist) {
        bestDist = dist;
        best = pane;
      }
    }

    if (best) this.focus(best.id);
  }

  getPaneEditorEl(id) {
    const leaf = this._findLeaf(this.root, id);
    return leaf ? leaf.editorEl : null;
  }

  getAllPaneIds() {
    return this._allLeaves(this.root).map(l => l.id);
  }

  _getPaneRect(id) {
    const el = this.el.querySelector(`[data-id="${id}"]`);
    return el ? el.getBoundingClientRect() : null;
  }

  _findLeaf(node, id) {
    if (!node) return null;
    if (node.type === 'leaf') return node.id === id ? node : null;
    for (const child of node.children) {
      const found = this._findLeaf(child, id);
      if (found) return found;
    }
    return null;
  }

  _firstLeaf(node) {
    if (!node) return null;
    if (node.type === 'leaf') return node;
    return this._firstLeaf(node.children[0]);
  }

  _allLeaves(node) {
    if (!node) return [];
    if (node.type === 'leaf') return [node];
    return node.children.flatMap(c => this._allLeaves(c));
  }

  _removeLeaf(node, parent, id) {
    if (node.type === 'leaf') return false;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.type === 'leaf' && child.id === id) {
        const sibling = node.children[1 - i];
        // Replace this container with the sibling
        Object.keys(node).forEach(k => delete node[k]);
        Object.assign(node, sibling);
        return true;
      }
      if (this._removeLeaf(child, node, id)) return true;
    }
    return false;
  }

  _render() {
    this.el.innerHTML = '';
    if (!this.root) return;
    this.el.appendChild(this._buildDOM(this.root));
    if (this.focusedId) this.focus(this.focusedId);
  }

  _buildDOM(node) {
    if (node.type === 'leaf') {
      const pane = document.createElement('div');
      pane.className = 'split-pane';
      pane.dataset.id = node.id;
      if (node.editorEl) pane.appendChild(node.editorEl);
      node.el = pane;

      pane.addEventListener('mousedown', () => {
        if (this.focusedId !== node.id) this.focus(node.id);
      });

      return pane;
    }

    const container = document.createElement('div');
    container.className = `split-container ${node.direction}`;

    for (let i = 0; i < node.children.length; i++) {
      if (i > 0) {
        const divider = document.createElement('div');
        divider.className = 'split-divider';
        this._setupDividerDrag(divider, container, node, i - 1);
        container.appendChild(divider);
      }
      const childEl = this._buildDOM(node.children[i]);
      childEl.style.flex = `${node.sizes[i]} 0 0%`;
      container.appendChild(childEl);
    }

    return container;
  }

  _setupDividerDrag(divider, container, node, index) {
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const isVert = node.direction === 'vertical';
      const total = isVert ? rect.width : rect.height;
      const pos = isVert ? e.clientX - rect.left : e.clientY - rect.top;
      const pct = (pos / total) * 100;

      const min = 10;
      node.sizes[index] = Math.max(min, Math.min(100 - min, pct));
      node.sizes[index + 1] = 100 - node.sizes[index];

      const children = container.querySelectorAll(':scope > .split-pane, :scope > .split-container');
      if (children[0]) children[0].style.flex = `${node.sizes[index]} 0 0%`;
      if (children[1]) children[1].style.flex = `${node.sizes[index + 1]} 0 0%`;
    };

    const onMouseUp = () => {
      divider.classList.remove('dragging');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    divider.addEventListener('mousedown', (e) => {
      e.preventDefault();
      divider.classList.add('dragging');
      document.body.style.cursor = node.direction === 'vertical' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }
}
