/**
 * for watch mode
 * used to watch for changes in the project
 * ex: yarn dev
 */
const esbuild = require('esbuild');
const { watchBuildOptions } = require('./build.config');

async function watch() {
  const ctx = await esbuild.context(watchBuildOptions);

  ctx.watch();
  console.log('[main] esbuild watching for changes...');
}
watch();
