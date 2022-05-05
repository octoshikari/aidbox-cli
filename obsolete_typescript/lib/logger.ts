import debug from "debug";

debug.enable("generator*");

export const baseLog = debug("generator");
export const readerLog = baseLog.extend("reader");
export const writerLog = baseLog.extend("reader");
export const boxLog = baseLog.extend("box");
export const cliLog = baseLog.extend("cli");
export const cacheLog = baseLog.extend("cache");
