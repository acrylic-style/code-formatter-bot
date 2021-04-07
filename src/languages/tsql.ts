import { format } from 'sql-formatter'
import Language from '../language'

export default class extends Language {
  public languageCode: string = 'tsql'

  public async format(src: string): Promise<string> {
    return format(src, { language: 'tsql' })
  }
}
