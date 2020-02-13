import path from 'path'
import fs from 'fs'
import curry from 'lodash.curry'

type Options = {}

type Operation = 'add' | 'remove' | 'set'

export const gitignore = curry(function gitignore(
  directory: string,
  operation: Operation,
  pattern: string | string[]
) {
  const filename = path.join(directory, '.gitignore')

  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, '')
  }

  let contents = fs.readFileSync(filename, 'utf8')

  const patterns = !Array.isArray(pattern) ? [pattern] : pattern

  switch (operation) {
    case 'set':
      contents = patterns.join('\n')
      break

    // @todo implement add / remove
  }

  fs.writeFileSync(filename, contents + '\n')
})
