import { App } from './ui/App.js';
import { loadDefaults } from './fs/defaults.js';
import { registerCommands } from './commands.js';
import { registerKeymaps } from './keymaps.js';

// Populate VFS with example files on first run
loadDefaults();

// Boot the app
const root = document.getElementById('app');
const app = new App(root);

// Register ex commands and keymaps
registerCommands(app);
registerKeymaps(app);

// Show splash screen
app.showSplash();

// Handle window resize
window.addEventListener('resize', () => {
  const view = app.getActiveView();
  if (view) view.requestMeasure();
});

// Prevent accidental page close with unsaved work
window.addEventListener('beforeunload', (e) => {
  const hasModified = [...app.buffers.values()].some(b => b.modified);
  if (hasModified) {
    e.preventDefault();
    e.returnValue = '';
  }
});
