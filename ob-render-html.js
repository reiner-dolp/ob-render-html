"use strict";

const util = require('./util');
const puppeteer = require('puppeteer');
const path = require('path');

function read_stdin() {
        return new Promise(resolve => {
                var stdin = process.stdin,
                    inputChunks = [];

                stdin.resume();
                stdin.setEncoding('utf8');

                stdin.on('data', function (chunk) {
                    inputChunks.push(chunk);
                });

                stdin.on('end', function () {
                    var input = inputChunks.join();
                    resolve(input);
                });
        });
}

if (process.argv.length <= 2) {
    util.exitWithError("Usage: " + argv[0] + " " + argv[1] + " WIDTH HEIGHT SCALE OUTPUT_FILENAME [SELECTOR]");
}

var viewport = {
        width: ~~(+process.argv[2]),
        height: ~~(+process.argv[3]),
        deviceScaleFactor: +process.argv[4]
};

if (viewport.width <= 0) {
    util.exitWithError("WIDTH has to be a positive integer");
}

if (viewport.height <= 0) {
    util.exitWithError("HEIGHT has to be a positive integer");
}

if (viewport.deviceScaleFactor <= 0) {
    util.exitWithError("SCALE has to be a positive integer");
}

var out_filename = process.argv[5];
var selector = process.argv[6];

var browser;

(async () => {

    const page_content = await read_stdin();
    
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.setViewport(viewport);
    await page.setContent(page_content);
    
    var page_element;
    var screenshot_options = {
        path: out_filename,
    };
    
    if (selector) {
        page_element = await page.$(selector);
        if(page_element === null) {
            return Promise.reject(new Error("selected element could not be found"));
        }
    } else {
        page_element = page;
        screenshot_options.fullPage = true;
    }
    
    await page_element.screenshot(screenshot_options);
    
    browser.close();

})().catch((e) => {
    if(browser && browser.close) {
        browser.close();
    }

    exitWithError("Rendering failed: " + e);
});
