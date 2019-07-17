#!/usr/bin/env node
'use strict';

const { parse } = require('acorn');

if (process.stdin.isTTY) {

    require('repl').start({
        eval: (cmd, context, filename, callback) => callback(null, parse(cmd)),
        writer: JSON.stringify
    });

} else {

    const streamify = require('async-stream-generator');

    async function* _parse(chunks) {
        for await (const chunk of chunks) {
            yield JSON.stringify(parse(chunk));
        }
    }

    try {
        streamify(_parse(process.stdin)).pipe(process.stdout);
    } catch (e) {
        console.log(e && e.message || e);
    }

}
