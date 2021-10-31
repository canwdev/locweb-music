import {supportedMusicFormat} from './regex'

export const isSupportedMusicFormat = (filename) => {
  return supportedMusicFormat.test(filename)
}
