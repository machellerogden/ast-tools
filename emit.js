#!/usr/bin/env node

const { generate:emit } = require('astring');


if (process.stdin.isTTY) {

    require('repl').start({
        eval: (cmd, context, filename, callback) => callback(null, JSON.parse(cmd)),
        writer: emit
    });

} else {

    const streamify = require('async-stream-generator');

    async function* _emit(chunks) {
        for await (const chunk of chunks) {
            yield emit(JSON.parse(chunk));
        }
    }

    try {
        streamify(_emit(process.stdin)).pipe(process.stdout);
    } catch (e) {
        console.log(e && e.message || e);
    }

}
