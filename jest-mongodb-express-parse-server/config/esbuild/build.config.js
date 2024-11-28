/**
 * used when building the project
 * ex: yarn build
 */
const esbuild = require('esbuild');
const path = require('path');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { copy } = require('esbuild-copy-files');

const defaultBuildOptions = {
  // entryPoints: [path.resolve(__dirname, '../../src/index.ts'), path.resolve(__dirname, '../../src/cloud/index.ts')],
  entryPoints: [
    { in: path.resolve(__dirname, '../../src/index.ts'), out: path.resolve(__dirname, '../../dist/index') },
    { in: path.resolve(__dirname, '../../src/cloud/index.ts'), out: path.resolve(__dirname, '../../dist/cloud/index') },
  ],
  // see: https://stackoverflow.com/questions/71837664/does-esbuild-provide-a-feature-like-the-resolve-alias-option-in-webpack
  bundle: true,
  platform: 'node',
  outdir: 'dist',
  sourcemap: true,
};

/**
 * options for building the project
 * see the script 'build' in package.json
 * we are using the watch option to watch for changes
 */
const buildOptions = {
  ...defaultBuildOptions,
  plugins: [
    nodeExternalsPlugin(),
    copy({
      stopWatching: true,
      patterns: [
        {
          from: [path.resolve(__dirname, '../../src/locales')],
          to: [path.resolve(__dirname, '../../dist/locales')],
        }
      ],
    }),
  ],
};

/**
 * options for building the project in watch mode (watching for changes)
 * we do not stop watching for changes (stopWatching: false)
 */
const watchBuildOptions = {
  ...defaultBuildOptions,
  plugins: [
    nodeExternalsPlugin(),
    copy({
      watch: true,
      patterns: [
        {
          from: [path.resolve(__dirname, '../../src/locales')],
          to: [path.resolve(__dirname, '../../dist/locales')],
          ignore: ['*3.json'],
          watch: true,
        },
      ]
    }),
  ],
};

exports.watchBuildOptions = watchBuildOptions;

async function build() {
  esbuild.build(buildOptions);
}
build();
