import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// Catppuccin Mocha palette
export const mocha = {
  rosewater: '#f5e0dc',
  flamingo:  '#f2cdcd',
  pink:      '#f5c2e7',
  mauve:     '#cba6f7',
  red:       '#f38ba8',
  maroon:    '#eba0ac',
  peach:     '#fab387',
  yellow:    '#f9e2af',
  green:     '#a6e3a1',
  teal:      '#94e2d5',
  sky:       '#89dceb',
  sapphire:  '#74c7ec',
  blue:      '#89b4fa',
  lavender:  '#b4befe',
  text:      '#cdd6f4',
  subtext1:  '#bac2de',
  subtext0:  '#a6adc8',
  overlay2:  '#9399b2',
  overlay1:  '#7f849c',
  overlay0:  '#6c7086',
  surface2:  '#585b70',
  surface1:  '#45475a',
  surface0:  '#313244',
  base:      '#1e1e2e',
  mantle:    '#181825',
  crust:     '#11111b',
};

const editorTheme = EditorView.theme({
  '&': {
    color: mocha.text,
    backgroundColor: mocha.base,
    fontSize: '14px',
    height: '100%',
  },
  '.cm-content': {
    caretColor: mocha.text,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', 'Consolas', monospace",
    padding: '4px 0',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: mocha.text,
    borderLeftWidth: '2px',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: mocha.text,
  },
  // Vim fat cursor
  '.cm-fat-cursor .cm-cursor': {
    background: mocha.text + ' !important',
    border: 'none !important',
    width: '0.6em',
  },
  '.cm-fat-cursor .cm-cursor, .cm-animate-fat-cursor': {
    background: mocha.text,
    border: 'none',
  },
  '&:not(.cm-focused) .cm-fat-cursor .cm-cursor': {
    background: 'none !important',
    outline: `1px solid ${mocha.text} !important`,
  },
  '.cm-selectionBackground': {
    backgroundColor: `${mocha.surface1} !important`,
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: `${mocha.surface1} !important`,
  },
  '.cm-activeLine': {
    backgroundColor: mocha.surface0 + '80',
  },
  '.cm-gutters': {
    backgroundColor: mocha.mantle,
    color: mocha.overlay0,
    border: 'none',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  '.cm-activeLineGutter': {
    backgroundColor: mocha.surface0 + '80',
    color: mocha.yellow,
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 16px',
  },
  '.cm-matchingBracket': {
    backgroundColor: mocha.surface2,
    outline: `1px solid ${mocha.overlay0}`,
    color: mocha.text,
  },
  '.cm-nonmatchingBracket': {
    color: mocha.red,
  },
  '.cm-searchMatch': {
    backgroundColor: mocha.yellow + '40',
    outline: `1px solid ${mocha.yellow}80`,
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: mocha.peach + '40',
  },
  '.cm-selectionMatch': {
    backgroundColor: mocha.surface2 + '80',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: mocha.surface0,
    color: mocha.subtext0,
    border: 'none',
  },
  '.cm-tooltip': {
    backgroundColor: mocha.surface0,
    color: mocha.text,
    border: `1px solid ${mocha.surface1}`,
    borderRadius: '4px',
  },
  '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
    backgroundColor: mocha.surface1,
    color: mocha.text,
  },
  // Panels (search, etc.)
  '.cm-panels': {
    backgroundColor: mocha.mantle,
    color: mocha.text,
  },
  '.cm-panels.cm-panels-bottom': {
    borderTop: `1px solid ${mocha.surface0}`,
  },
  '.cm-panel input, .cm-panel button, .cm-panel label': {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    color: mocha.text,
  },
  '.cm-panel input': {
    background: mocha.surface0,
    border: `1px solid ${mocha.surface1}`,
    borderRadius: '2px',
    padding: '2px 6px',
    outline: 'none',
  },
  '.cm-panel input:focus': {
    borderColor: mocha.blue,
  },
  '.cm-panel button': {
    background: mocha.surface0,
    border: `1px solid ${mocha.surface1}`,
    borderRadius: '2px',
    padding: '2px 8px',
    cursor: 'pointer',
  },
  '.cm-panel button:hover': {
    background: mocha.surface1,
  },
  // Vim command line
  '.cm-vim-panel': {
    padding: '2px 8px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    backgroundColor: mocha.mantle,
    color: mocha.text,
  },
  '.cm-vim-panel input': {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: mocha.text,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
  },
  // Scrollbar (standards-based — works in all modern browsers)
  '.cm-scroller': {
    scrollbarWidth: 'thin',
    scrollbarColor: `${mocha.surface1} ${mocha.mantle}`,
    overflow: 'auto',
  },
}, { dark: true });

const highlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: mocha.mauve },
  { tag: [t.controlKeyword, t.moduleKeyword, t.operatorKeyword], color: mocha.mauve },
  { tag: [t.name, t.deleted, t.character], color: mocha.text },
  { tag: [t.propertyName], color: mocha.lavender },
  { tag: [t.macroName], color: mocha.red },
  { tag: [t.function(t.variableName)], color: mocha.blue },
  { tag: [t.function(t.propertyName)], color: mocha.blue },
  { tag: [t.labelName], color: mocha.mauve },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: mocha.peach },
  { tag: [t.definition(t.name), t.separator], color: mocha.text },
  { tag: [t.typeName, t.className, t.namespace], color: mocha.yellow },
  { tag: [t.number, t.changed, t.annotation, t.modifier, t.self], color: mocha.peach },
  { tag: [t.operator], color: mocha.sky },
  { tag: [t.string, t.special(t.string)], color: mocha.green },
  { tag: [t.escape], color: mocha.pink },
  { tag: [t.regexp], color: mocha.pink },
  { tag: [t.meta], color: mocha.mauve },
  { tag: [t.comment], color: mocha.overlay0, fontStyle: 'italic' },
  { tag: [t.strong], fontWeight: 'bold', color: mocha.red },
  { tag: [t.emphasis], fontStyle: 'italic', color: mocha.maroon },
  { tag: [t.strikethrough], textDecoration: 'line-through' },
  { tag: [t.link], color: mocha.sapphire, textDecoration: 'underline' },
  { tag: [t.heading], fontWeight: 'bold', color: mocha.red },
  { tag: [t.heading1], fontWeight: 'bold', color: mocha.red },
  { tag: [t.heading2], fontWeight: 'bold', color: mocha.peach },
  { tag: [t.heading3], fontWeight: 'bold', color: mocha.yellow },
  { tag: [t.heading4], fontWeight: 'bold', color: mocha.green },
  { tag: [t.heading5], fontWeight: 'bold', color: mocha.blue },
  { tag: [t.heading6], fontWeight: 'bold', color: mocha.mauve },
  { tag: [t.atom, t.bool], color: mocha.peach },
  { tag: [t.url], color: mocha.sapphire, textDecoration: 'underline' },
  { tag: t.invalid, color: mocha.red },
  { tag: t.processingInstruction, color: mocha.blue },
  { tag: t.inserted, color: mocha.green },
  // HTML/XML tags
  { tag: t.tagName, color: mocha.blue },
  { tag: t.attributeName, color: mocha.yellow },
  { tag: t.attributeValue, color: mocha.green },
  { tag: t.angleBracket, color: mocha.overlay2 },
  { tag: t.documentMeta, color: mocha.mauve },
]);

export const catppuccinMocha = [editorTheme, syntaxHighlighting(highlightStyle)];
