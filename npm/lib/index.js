"use strict";
const path = require("path");

module.exports.aidboxPath = path.join(
    __dirname,
    `../bin/aidbox-cli${process.platform === "win32" ? ".exe" : ""}`
);