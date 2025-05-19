// rollup.config.js
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json' assert { type: 'json' };

export default [
  // CommonJS (for Node) and ES module (for bundlers) build
  {
    input: 'src/index.js',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
        ],
      }),
      resolve(),
      commonjs(),
    ],
    external: ['react'],
  },
  // Minified UMD build (for browsers)
  {
    input: 'src/index.js',
    output: {
      name: 'validux',
      file: 'dist/index.umd.min.js',
      format: 'umd',
      globals: {
        react: 'React',
      },
      exports: 'named',
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
        ],
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
    external: ['react'],
  },
];