'use strict'

const fs = require('fs')
const path = require('path')
const Fontmin = require('fontmin')
const rename = require('gulp-rename')

function minify(inputFile, outputFile, { srcDir }) {
  const outputFileDir = path.dirname(outputFile)
  const outputFileName = path.basename(outputFile)

  let text = alphanumericChars()
  if (srcDir) {
    const chars = uniqueChars(srcDir)
    text += chars
  }

  const fontmin = new Fontmin()
    .src(inputFile)
    .dest(outputFileDir)
    .use(
      Fontmin.glyph({
        text,
        hinting: false,
        trim: true,
      })
    )
    .use(rename(outputFileName))

  fontmin.run(err => {
    if (err) {
      throw err
    }
  })
}

module.exports = minify

function uniqueChars(dir) {
  const content = readContent(dir)
  const chars = scanUniqueChars(content)

  return chars
}

function alphanumericChars() {
  return '01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
}

function readContent(entry) {
  let content = ''

  const stat = fs.lstatSync(entry)
  const isDirectory = stat.isDirectory()
  if (isDirectory) {
    const subEntries = fs.readdirSync(entry)
    subEntries
      .filter(subEntry => subEntry !== '.DS_Store')
      .map(subEntry => path.join(entry, subEntry))
      .forEach(subEntry => {
        content += readContent(subEntry)
      })
  } else {
    const fileContent = fs.readFileSync(entry, { encoding: 'utf8' })
    content += fileContent
  }

  return content
}

function scanUniqueChars(content) {
  const chars = []
  const filteredChars = ['\n']

  for (const char of content) {
    if (!filteredChars.includes(char) && !chars.includes(char)) {
      chars.push(char)
    }
  }

  return chars.join('')
}
