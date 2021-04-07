import Language from '../language'

const prettier = require('prettier')

export default class extends Language {
  public languageCode: string = 'ruby'

  public async format(src: string): Promise<string> {
    return prettier.format(src, {
      parser: 'ruby',
    })
  }
}
