import { EditorView, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput, indentUnit, foldGutter, foldKeymap } from '@codemirror/language';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { vim } from '@replit/codemirror-vim';
import { catppuccinMocha } from './theme.js';
import { getLanguage } from './languages.js';

export function createEditorState(content = '', filename = '', onUpdate = null) {
  const lang = getLanguage(filename);
  const extensions = [
    vim(),
    ...catppuccinMocha,
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...searchKeymap,
    ]),
    EditorState.tabSize.of(2),
    indentUnit.of('  '),
    EditorView.lineWrapping,
  ];

  if (lang) {
    extensions.push(lang);
  }

  if (onUpdate) {
    extensions.push(EditorView.updateListener.of(onUpdate));
  }

  return EditorState.create({
    doc: content,
    extensions,
  });
}

export function createEditorView(parent, state) {
  return new EditorView({
    state,
    parent,
  });
}
