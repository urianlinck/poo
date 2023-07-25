export class Videos {
  constructor(
    private id: string,
    private title: string,
    private duration: number,
    private uploadDate: string | undefined
  ) {
    this.id = id
    this.title = title
    this.duration = duration
    this.uploadDate = uploadDate
  }

  public getId(){
    return this.id
  }
  public setId(newId: string): void{
    this.id = newId
  }

  public getTitle(){
    return this.title
  }
  public setTitle(newTitle: string): void{
    this.title = newTitle
  }

  public getDuration(){
    return this.duration
  }
  public setDuration(newDuration: number): void{
    this.duration = newDuration
  }

  public getUpDate(): string | undefined{
    return this.uploadDate
  }
  public setUpDate(newUpDate: string): void{
    this.uploadDate = newUpDate
  }
}
