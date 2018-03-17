"use strict";

exports.exitWithError = function exitWithError(msg) {
    console.log(msg);
    process.exit(1);
}
