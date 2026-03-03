import { Vim } from '@replit/codemirror-vim';

export function registerKeymaps(app) {
  // gt / gT - tab switching
  Vim.defineAction('nextTab', () => {
    app.nextTab();
  });
  Vim.defineAction('prevTab', () => {
    app.prevTab();
  });
  Vim.mapCommand('gt', 'action', 'nextTab');
  Vim.mapCommand('gT', 'action', 'prevTab');

  // Ctrl-W splits and navigation
  Vim.defineAction('splitHorizontal', () => {
    app.splitPane('horizontal');
  });
  Vim.defineAction('splitVertical', () => {
    app.splitPane('vertical');
  });
  Vim.defineAction('navigateLeft', () => {
    app.navigateSplit('left');
  });
  Vim.defineAction('navigateDown', () => {
    app.navigateSplit('down');
  });
  Vim.defineAction('navigateUp', () => {
    app.navigateSplit('up');
  });
  Vim.defineAction('navigateRight', () => {
    app.navigateSplit('right');
  });
  Vim.defineAction('closePane', () => {
    app.closePane();
  });
  Vim.defineAction('closeOtherPanes', () => {
    app.closeOtherPanes();
  });

  Vim.mapCommand('<C-w>s', 'action', 'splitHorizontal');
  Vim.mapCommand('<C-w>v', 'action', 'splitVertical');
  Vim.mapCommand('<C-w>h', 'action', 'navigateLeft');
  Vim.mapCommand('<C-w>j', 'action', 'navigateDown');
  Vim.mapCommand('<C-w>k', 'action', 'navigateUp');
  Vim.mapCommand('<C-w>l', 'action', 'navigateRight');
  Vim.mapCommand('<C-w>c', 'action', 'closePane');
  Vim.mapCommand('<C-w>o', 'action', 'closeOtherPanes');
}
