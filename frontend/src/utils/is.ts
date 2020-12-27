import {supportedMusicFormat} from './regex'

export const isSupportedMusicFormat = (filename: string) => {
  const suffix = filename.split('.').pop() || ''
  return supportedMusicFormat.test(suffix)
};
