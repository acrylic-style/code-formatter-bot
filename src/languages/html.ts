import Language from '../language'

const prettify = require('html-prettify')

export default class extends Language {
  public languageCode: string = 'html'

  public async format(src: string): Promise<string> {
    return prettify(src)
  }
}
