import {getClientHostUrl} from '@/utils/client'

export const FileAction = {
  RENAME: 'RENAME',
  DELETE: 'DELETE',
  CREATE_FOLDER: 'CREATE_FOLDER',
}
export const LS_KEY_NCM_API_URL = 'LOCWEB_NCM_API_URL'
export const LS_KEY_API_HOST = 'LOCWEB_API_HOST'

// server api url
export const HOST_URL_DEFAULT = getClientHostUrl()
export const HOST_URL =
  localStorage.getItem(LS_KEY_API_HOST) || HOST_URL_DEFAULT

// https://github.com/Binaryify/NeteaseCloudMusicApi
export const NCM_API_URL_DEFAULT =
  process.env.REACT_APP_NCM_API_URL || 'https://konsole.top:9001'
export const NCM_API_URL =
  localStorage.getItem(LS_KEY_NCM_API_URL) || NCM_API_URL_DEFAULT
