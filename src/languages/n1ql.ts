import { format } from 'sql-formatter'
import Language from '../language'

export default class extends Language {
  public languageCode: string = 'n1ql'

  public async format(src: string): Promise<string> {
    return format(src, { language: 'n1ql' })
  }
}
