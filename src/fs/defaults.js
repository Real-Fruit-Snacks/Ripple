import { vfs } from './VirtualFS.js';

const defaultFiles = {
  'welcome.txt': `
  Welcome to Vim in the Browser!
  ==============================

  This is a fully-featured Vim editor running in your browser,
  powered by CodeMirror 6 and styled with Catppuccin Mocha.

  Quick Start:
    :e <filename>    Open a file
    :w               Save current file
    :ls              List open buffers
    :files           List all files in virtual filesystem
    :tabnew <file>   Open file in new tab
    :split <file>    Horizontal split
    :vsplit <file>   Vertical split
    :help            Show help

  Navigation:
    gt / :tabnext    Next tab
    gT / :tabprev    Previous tab
    Ctrl-W h/j/k/l   Navigate splits
    Ctrl-W c         Close split
    Ctrl-W o         Close other splits

  All files are saved to your browser's localStorage.
  Happy Vimming!
`.trimStart(),

  'hello.js': `// JavaScript example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const greet = (name) => \`Hello, \${name}!\`;

class Calculator {
  constructor() {
    this.result = 0;
  }

  add(n) {
    this.result += n;
    return this;
  }

  multiply(n) {
    this.result *= n;
    return this;
  }

  valueOf() {
    return this.result;
  }
}

// Try it out
const calc = new Calculator();
calc.add(5).multiply(3);
console.log(\`Result: \${calc}\`);
console.log(\`Fib(10): \${fibonacci(10)}\`);
console.log(greet("Vim"));
`,

  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <h1>Hello, World!</h1>
    <p>This is an example HTML file.</p>
    <button id="btn">Click me</button>
  </main>
  <script src="hello.js"></script>
</body>
</html>
`,

  'style.css': `/* Catppuccin-inspired styles */
:root {
  --base: #1e1e2e;
  --text: #cdd6f4;
  --blue: #89b4fa;
  --green: #a6e3a1;
  --surface0: #313244;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--base);
  color: var(--text);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

main {
  text-align: center;
  padding: 2rem;
}

h1 {
  color: var(--blue);
  margin-bottom: 1rem;
}

button {
  background: var(--surface0);
  color: var(--green);
  border: 1px solid var(--green);
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background 0.2s;
}

button:hover {
  background: var(--green);
  color: var(--base);
}
`,

  'app.py': `"""Python example - Simple task manager."""
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime


@dataclass
class Task:
    title: str
    done: bool = False
    created: datetime = field(default_factory=datetime.now)
    priority: int = 0

    def complete(self) -> None:
        self.done = True

    def __str__(self) -> str:
        status = "[x]" if self.done else "[ ]"
        return f"{status} {self.title} (priority: {self.priority})"


class TaskManager:
    def __init__(self) -> None:
        self.tasks: list[Task] = []

    def add(self, title: str, priority: int = 0) -> Task:
        task = Task(title=title, priority=priority)
        self.tasks.append(task)
        return task

    def complete(self, index: int) -> Optional[Task]:
        if 0 <= index < len(self.tasks):
            self.tasks[index].complete()
            return self.tasks[index]
        return None

    def pending(self) -> list[Task]:
        return [t for t in self.tasks if not t.done]

    def by_priority(self) -> list[Task]:
        return sorted(self.tasks, key=lambda t: -t.priority)


if __name__ == "__main__":
    mgr = TaskManager()
    mgr.add("Learn Vim motions", priority=3)
    mgr.add("Configure editor theme", priority=2)
    mgr.add("Write some code", priority=1)
    mgr.complete(1)

    print("All tasks:")
    for task in mgr.by_priority():
        print(f"  {task}")
`,

  'notes.md': `# Notes

## Vim Tips

### Navigation
- \`h/j/k/l\` - left/down/up/right
- \`w/b/e\` - word forward/back/end
- \`0/$\` - line start/end
- \`gg/G\` - file start/end
- \`{/}\` - paragraph up/down
- \`Ctrl-D/Ctrl-U\` - half page down/up

### Editing
- \`i/a\` - insert before/after cursor
- \`o/O\` - new line below/above
- \`dd\` - delete line
- \`yy\` - yank line
- \`p/P\` - paste after/before
- \`ciw\` - change inner word
- \`.\` - repeat last change

### Search
- \`/pattern\` - search forward
- \`?pattern\` - search backward
- \`n/N\` - next/previous match
- \`*/#\` - search word under cursor

## Project Ideas
- [ ] Build a static site generator
- [ ] Create a markdown previewer
- [ ] Write a simple game
`,

  'config.json': `{
  "editor": {
    "theme": "catppuccin-mocha",
    "fontSize": 14,
    "fontFamily": "JetBrains Mono",
    "lineNumbers": true,
    "relativeLine": false,
    "wordWrap": true,
    "tabSize": 2
  },
  "vim": {
    "enabled": true,
    "clipboard": "system"
  },
  "files": {
    "autoSave": false,
    "trimWhitespace": true
  }
}
`,
};

export function loadDefaults() {
  if (!vfs.isEmpty()) return;
  for (const [name, content] of Object.entries(defaultFiles)) {
    vfs.writeFile(name, content);
  }
}
