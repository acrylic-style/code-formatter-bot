import Language from '../language'

const prettier = require('prettier')

export default class extends Language {
  public languageCode: string = 'php'
  public notes = ['Mixed PHP and HTML is unstable.']

  public async format(src: string): Promise<string> {
    return prettier.format(src, {
      parser: 'php',
    })
  }
}
