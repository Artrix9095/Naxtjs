import { NaxtConfig } from "../../types";
import { build as _build } from "vite";
import { protectedRequire } from "../../util/functions";
import path from "path";

export default function init(config: NaxtConfig) {

    build(config);

}

export function build(config: NaxtConfig) {
    _build({
        plugins: [
            protectedRequire('vite-plugin-solid')()
        ],
        build: {
           ssr: true,
           target: 'esnext',
           outDir: path.join(__dirname, '../../../out'),
           polyfillDynamicImport: false,
           assetsDir: path.join(config.cwd, 'public'),
           sourcemap: true,

           rollupOptions: {
            input: path.join(config.cwd, 'pages/*.{ts,js}'),
           }
        },
        
        
    })
}