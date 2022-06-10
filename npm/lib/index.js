"use strict";
const path = require("path");

module.exports.aidboxPath = path.join(
    __dirname,
    `../bin/aidbox${process.platform === "win32" ? ".exe" : ""}`
);