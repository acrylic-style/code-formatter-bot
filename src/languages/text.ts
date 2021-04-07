import Language from '../language'

const SpellChecker = require('spellchecker')

const replaceRange = (
  s: string,
  start: number,
  end: number,
  substitute: string
) => s.substring(0, start) + substitute + s.substring(end)

type SingleResult = {
  start: number
  end: number
}

export default class extends Language {
  public languageCode: string = 'text'

  public async format(src: string): Promise<string> {
    if (!SpellChecker.isMisspelled(src)) return src
    let result = src
    const note = new Array<string>()
    SpellChecker.checkSpelling(src).forEach((el: SingleResult) => {
      const before = result.substring(el.start, el.end)
      const correction = SpellChecker.getCorrectionsForMisspelling(before)[0]
      if (before.toUpperCase() === correction) {
        note.push(
          `${el.start}-${el.end} ("${before}" -> "${correction}"): Convert to uppercase`
        )
      } else if (before.toLowerCase() === correction) {
        note.push(
          `${el.start}-${el.end} ("${before}" -> "${correction}"): Convert to lowercase`
        )
      } else if (before.replace(/'/g, '') === correction.replace(/'/g, '')) {
        note.push(
          `${el.start}-${el.end} ("${before}" -> "${correction}"): "'" issues (un-needed, wrong position or too many "'"s etc)`
        )
      } else {
        note.push(
          `${el.start}-${el.end} ("${before}" -> "${correction}"): (I don't know what is this)`
        )
      }
      result = replaceRange(result, el.start, el.end, correction)
    })
    return `${result}\n\`\`\`\nProblems:\n\`\`\`\n${note.join('\n')}`
  }
}
