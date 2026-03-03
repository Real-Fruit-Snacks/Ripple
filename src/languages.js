import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { markdown } from '@codemirror/lang-markdown';
import { json } from '@codemirror/lang-json';

const languageMap = {
  js: () => javascript(),
  jsx: () => javascript({ jsx: true }),
  ts: () => javascript({ typescript: true }),
  tsx: () => javascript({ typescript: true, jsx: true }),
  html: () => html(),
  htm: () => html(),
  css: () => css(),
  py: () => python(),
  md: () => markdown(),
  markdown: () => markdown(),
  json: () => json(),
};

export function getLanguage(filename) {
  if (!filename) return null;
  const ext = filename.split('.').pop().toLowerCase();
  const factory = languageMap[ext];
  return factory ? factory() : null;
}

export function getFileType(filename) {
  if (!filename) return 'text';
  const ext = filename.split('.').pop().toLowerCase();
  const typeMap = {
    js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
    html: 'html', htm: 'html', css: 'css',
    py: 'python', md: 'markdown', markdown: 'markdown',
    json: 'json', txt: 'text',
  };
  return typeMap[ext] || ext || 'text';
}
