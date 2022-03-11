export const supportedMusicFormat = /\.(mp3|wav|ogg|flac)$/i
export const isSupportedMusicFormat = (filename) => {
  return supportedMusicFormat.test(filename)
}
