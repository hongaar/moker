#!/usr/bin/env node

const app = require('./lib/program').default

process.argv.slice(2).length ? app.run() : app.repl()
