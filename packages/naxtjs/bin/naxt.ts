#!/usr/bin/env node
import { protectedRequire, solidIsInstalled } from "../util/functions";
import fs from 'fs'
import { NaxtConfig, NaxtUserConfig } from '../types';
import { Command } from 'commander';
import path from "path";


if(!solidIsInstalled()) { // check if solid is installed
    console.error("Solidjs is not installed. Please run 'npm install solid-js' to continue.");
    process.exit(1);
}
// init commander
const program = new Command()
    .name('naxt')
    .description('A command line tool for interacting with Naxtjs')
    .version(require('../../package.json').version) // double ../ because of dist dir

const DIRECTORY = process.cwd();


// init commands
program
    .command('dev')
    .option('-c, --config <config path>', 'The path to your config file.', path.join(DIRECTORY, 'naxt.config.js'))
    .description('Start the development server')
    .action(({ config }) => {
        if(!fs.existsSync(config)) { // check if naxt.config.js exists
            console.error("No config found. Please create one to continue.");
            process.exit(1);
        }
        const cfg: NaxtConfig = {...protectedRequire(config), cwd: DIRECTORY} 
        import('../server/dev').then(dev => dev.default(cfg))
        });


program.parse()