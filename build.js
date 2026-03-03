import esbuild from 'esbuild';
import fs from 'fs';

const watch = process.argv.includes('--watch');
const serve = process.argv.includes('--serve');

// Clean and copy index.html to dist
fs.mkdirSync('dist', { recursive: true });
fs.copyFileSync('public/index.html', 'dist/index.html');
// Remove stale sourcemap from production builds
if (!watch) {
  try { fs.unlinkSync('dist/vim.js.map'); } catch (_e) { /* ignore */ }
}

const buildOptions = {
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/vim.js',
  format: 'iife',
  minify: !watch,
  sourcemap: watch,
  target: ['es2020'],
  logLevel: 'info',
};

async function main() {
  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    if (serve) {
      const { host, port } = await ctx.serve({ servedir: 'dist', port: 8080 });
      console.log(`Serving at http://${host}:${port}`);
    }
    console.log('Watching for changes...');
  } else {
    await esbuild.build(buildOptions);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
