// @ts-check
"use strict";

const os = require("os");
const fs = require("fs");
const path = require("path");
const util = require("util");

const download = require("./download");

const fsExists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

const forceInstall = process.argv.includes("--force");
if (forceInstall) {
    console.log("--force, ignoring caches");
}

const VERSION = "v0.3.3";
const BIN_PATH = path.join(__dirname, "../bin");

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled rejection: ", promise, "reason:", reason);
});

function getTarget() {
    const arch = process.env.npm_config_arch || os.arch();

    switch (os.platform()) {
        case "darwin":
            return arch === "x64" ? "darwin-x86_64" : "darwin-m1";
        case "win32":
            return "windows-x86_64"
        case "linux":
            return arch === "x64"
                ? "linux-x86_64"
                : arch === "arm"
                    ? "arm-unknown-linux-gnueabihf"
                    : arch === "arm64"
                        ? "aarch64-unknown-linux-gnu"
                        : arch === "ppc64"
                            ? "powerpc64le-unknown-linux-gnu"
                            : "i686-unknown-linux-musl";
        default:
            throw new Error("Unknown platform: " + os.platform());
    }
}

async function main() {
    const binExists = await fsExists(BIN_PATH);
    if (!binExists) {
        await mkdir(BIN_PATH);
    }

    const opts = {
        version: VERSION,
        token: process.env["GITHUB_TOKEN"],
        target: getTarget(),
        destDir: BIN_PATH,
        force: forceInstall,
    };
    try {
        await download(opts);
    } catch (err) {
        console.error(`Downloading aidbox-cli failed: ${err.stack}`);
        process.exit(1);
    }
}

main();