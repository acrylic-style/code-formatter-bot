export default abstract class Language {
  public abstract languageCode: string
  public notes = new Array<string>()

  public abstract format(src: string): Promise<string>
}
