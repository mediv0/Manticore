import buble from "@rollup/plugin-buble";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const banner = `/*!
 * Manticore v${pkg.version}
 * (c) ${new Date().getFullYear()} Mahdi Fakhr
 * @license MIT
 */`;

const configs = [
    {
        input: "src/index.js",
        file: "dist/Manticore.esm-browser.js",
        format: "es",
        browser: true,
        env: "development",
    },
    {
        input: "src/index.js",
        file: "dist/Manticore.esm-browser.prod.js",
        minify: true,
        format: "es",
        browser: true,
        env: "production",
    },
    {
        input: "src/index.js",
        file: "dist/Manticore.esm-bundler.js",
        format: "es",
        env: "development",
    },
];

function createEntries() {
    return configs.map((c) => createEntry(c));
}

function createEntry(config) {
    const c = {
        input: config.input,
        plugins: [],
        output: {
            banner,
            file: config.file,
            format: config.format,
        },
        onwarn: (msg, warn) => {
            if (!/Circular/.test(msg)) {
                warn(msg);
            }
        },
    };

    if (config.transpile !== false) {
        c.plugins.push(
            buble({
                objectAssign: "Object.assign",
            })
        );
    }

    c.plugins.push(resolve());
    c.plugins.push(commonjs());

    if (config.minify) {
        c.plugins.push(terser({ module: config.format === "es" }));
    }

    return c;
}

export default createEntries();
