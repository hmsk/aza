import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

export default {
  input: {
    index: 'src/index.ts',
    vendor: 'src/vendor.js'
  },
  output: {
    dir: 'dist',
    format: 'cjs',
    exports: 'named'
  },
  plugins: [json({ compact: true }), typescript({ declaration: true, declarationDir: 'dist', rootDir: 'src' }), nodeResolve()]
}
