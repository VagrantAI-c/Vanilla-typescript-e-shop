import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import postcss from 'rollup-plugin-postcss';

function createConfig(fileName) {
    return {
        input: `${fileName}.ts`,
        output: {
            file: `${fileName}.js`,
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

const configsList = [
    'src/index',
].map((fileName) => createConfig(fileName));

export default configsList;
