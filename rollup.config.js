import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import cssnano from 'cssnano';
import glob from 'glob';
import { format, parse } from 'path';
import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-cpy';
import bundleHtml from 'rollup-plugin-html2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

/** Folder to compile bundles to */
const DIST_FOLDER = './dist/';
/** This file would be searched among source folder */
const ENTRY_POINT_FILE = 'index.ts';

function distFolderFor(fileName) {
    return `${DIST_FOLDER}${(fileName || '').replace(ENTRY_POINT_FILE, '').replace('src/', '')}`;
}

function setExtension(fileName, extension) {
    const fileMetadata = parse(fileName);
    fileMetadata.ext = extension;
    delete fileMetadata.base;

    return format(fileMetadata);
}

function buildConfigs({environment}) {
    const isProd = environment === 'production';

    // Finds all index.ts files in current folder, excluding node_modules
    const configs = glob.sync(`**/${ENTRY_POINT_FILE}`, {
        root: __dirname,
        ignore: 'node_modules/**',
    })
        .flatMap(fileName => [
            {
                input: fileName,
                output: {
                    file: `${distFolderFor(fileName)}index.js`,
                    format: 'iife',
                    name: 'app',
                },
                plugins: [
                    clear({targets: [`${__dirname}/${distFolderFor(fileName)}`], watch: true}), // Clear dist folder before build
                    copy([
                        // Copy fontawesome fonts to assets folder
                        { files: './node_modules/@fortawesome/fontawesome-free/webfonts/', dest: `${distFolderFor(fileName)}/assets` },
                    ]),
                    postcss({ // Compile Sass to CSS
                        extract: `index.css`,
                        to: `${distFolderFor(fileName)}index.css`,
                        use: ['sass'],
                        plugins: [
                            postcssImport(),
                            postcssUrl([
                                // Replace fontawesome fonts so match assets folder from copy plugin above
                                { filter: '**/webfonts/**', url: asset => asset.url.replace('../webfonts/', 'assets/')}
                            ]),
                            isProd ? cssnano() : null, // Minify CSS
                        ],
                    }),
                    nodeResolve(),
                    typescript(),
                    isProd ? terser() : null, // Minify JS
                    bundleHtml({ // Bundles JS and CSS to html and copies it to dist
                        template: setExtension(fileName, '.html'),
                        minify: isProd 
                            ? {
                                removeComments: true,
                                collapseWhitespace: true,
                                keepClosingSlash: true,
                            } 
                            : false,
                    }),
                ],
            },
        ]);

    return configs;
}


export default args => {
    const configList = buildConfigs(args);
  
    return configList;
};
