import { NaxtConfig } from '../../types';
import { protectedRequire } from '../../util/functions';
import path from 'path';
import { transformAsync } from '@babel/core';
import { build as _build } from 'vite';
import { readFile, writeFile } from 'fs/promises';
import { createServer } from 'http';

export default async function init(config: NaxtConfig) {
    const [file] = await build([path.join(config.module, 'examples/index.tsx')]);
    console.log(file);
    createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <script>
                window.require = function(module) {
                    return import(module);
                }
            </script>
        </head>
        <body>
            <script type="module" id="component">
            ${file.umd}
            </script>
        </body>
        </html>`);
    }).listen(config.dev.port);
}

export async function build(files: string[]) {
    const dump = new Array<{ es: string; umd: string }>();
    for (const filename of files) {
        // const mjs = await transformAsync(code, {
        //     presets: [
        //         ['@babel/preset-typescript', {}],
        //         ['solid', { generate: 'ssr', hydratable: true }],
        //     ],
        //     filename,
        // });
        // @ts-ignore
        const [es, umd] = await _build({
            plugins: [require('vite-plugin-solid')()],
            build: {
                lib: {
                    entry: filename,
                    fileName: path.basename(filename).replace(/\.(ts|tsx|jsx)?$/, ''),
                    name: 'naxt',
                },
                write: false,
            },
        });
        console.log(es, umd);
        dump.push({ es: es.output[0].code, umd: umd.output[0].code });
    }
    return dump;
}
