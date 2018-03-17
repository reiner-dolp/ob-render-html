"use strict";

// Ensures that dependencies are correctly installed before
// invoking ob-render-html.js

const child_process = require('child_process');
const util = require('./util');
const path = require('path');

if(!moduleAvailable('puppeteer')) {
    installDependencies();
}
renderHtml();

function moduleAvailable(name) {
    try {
        require.resolve(name);
        return true;
    } catch(e){}
    return false;
}

function runScript(cmd, args, opts) {
        var err;
        try {
                opts = opts || {};
                opts.stdio =  [0,1,2];
                var result = child_process.spawnSync(cmd, args, opts);
                if(result.error) {
                    err = result.error;
                } else {
                    return;
                }
        } catch(e) {
           err = e;
        }
        util.exitWithError("failed to run script: " + cmd + " " + args.join(" ") + "\n\n" + err);
}

function installDependencies() {
        runScript("npm", ["install"], {cwd: __dirname });
}

function renderHtml() {
        // we call the module indirectly as a require after instalLDependencies()
        // does not resolve correctly.
        var args = process.argv.slice(2);
        runScript("node", [path.join(__dirname, 'ob-render-html.js')].concat(args));
}
