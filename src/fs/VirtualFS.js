const PREFIX = 'vfs:';
const META_PREFIX = 'vfs-meta:';

class VirtualFS {
  readFile(path) {
    return localStorage.getItem(PREFIX + path);
  }

  writeFile(path, content) {
    localStorage.setItem(PREFIX + path, content);
    localStorage.setItem(META_PREFIX + path, JSON.stringify({
      modified: Date.now(),
      size: content.length,
    }));
  }

  deleteFile(path) {
    localStorage.removeItem(PREFIX + path);
    localStorage.removeItem(META_PREFIX + path);
  }

  exists(path) {
    return localStorage.getItem(PREFIX + path) !== null;
  }

  getMeta(path) {
    const raw = localStorage.getItem(META_PREFIX + path);
    return raw ? JSON.parse(raw) : null;
  }

  listFiles() {
    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(PREFIX)) {
        files.push(key.slice(PREFIX.length));
      }
    }
    return files.sort();
  }

  isEmpty() {
    return this.listFiles().length === 0;
  }
}

export const vfs = new VirtualFS();
