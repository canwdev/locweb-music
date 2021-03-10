import {supportedMusicFormat} from './regex'

export const isSupportedMusicFormat = (filename: string) => {
  return supportedMusicFormat.test(filename)
};
