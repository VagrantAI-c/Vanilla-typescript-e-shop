import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import cssnano from 'cssnano';
import glob from 'glob';
import postcssImport from 'postcss-import';
import postcss from 'rollup-plugin-postcss';

function buildConfigs() {
    // Finds all index.ts files in current folder, excluding node_modules
    return glob.sync(`**/index.ts`, {
        root: __dirname,
        ignore: 'node_modules/**',
    })
        .map(fileName => createConfig(fileName));
}

function createConfig(fileName) {
    return {
        input: `${fileName}`,
        output: {
            file: fileName.replace('.ts', '.js'),
            format: 'iife',
            name: 'app',
        },
        plugins: [
            postcss({
                extract: `index.css`,
                use: ['sass'],
                plugins: [
                    postcssImport(),
                    cssnano(),
                ],
            }),
            nodeResolve(),
            typescript(),
        ],
    };
}

const configsList = buildConfigs();

export default configsList;
