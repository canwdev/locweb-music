export interface FileItemType {
  id: number
  filename: string
  isDirectory: boolean
  path: string
}

export enum FileType {
  DIR,
  MUSIC,
  OTHER,
}
