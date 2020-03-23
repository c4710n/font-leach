#!/usr/bin/env node
'use strict'

const minify = require('../lib')
const { name } = require('../package.json')
const path = require('path')
const yargs = require('yargs')

const { argv } = yargs
  .scriptName(name)
  .usage('$0 <input> <output> [options]')
  .option('s', {
    alias: 'src',
    demandOption: false,
    describe: 'specify directory of source code',
    type: 'string',
  })
  .help()

const {
  _: [input, output],
  src,
} = argv

if (!input) {
  console.error('input must be provided.\n')
  yargs.showHelp()
  return
}

if (!output) {
  console.error('output must be provied.\n')
  yargs.showHelp()
  return
}

const cwd = process.cwd()
const inputFile = path.join(cwd, input)
const outputFile = path.join(cwd, output)

const options = {}
if (src) {
  const srcDir = path.join(cwd, src)
  options.srcDir = srcDir
}

minify(inputFile, outputFile, options)
