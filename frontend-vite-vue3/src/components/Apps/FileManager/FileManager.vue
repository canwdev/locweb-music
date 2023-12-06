<script lang="ts">
import {defineComponent} from 'vue'
import {bytesToSize, formatDate} from '@/utils'
import {getList} from '@/api/music'
import {BackendFileItem, isSupportedMusicFormat} from '@/enum/file'
import {useMusicStore} from '@/store/music'
import {MusicItem} from '@/enum/music'

export default defineComponent({
  name: 'FileManager',
  setup() {
    const files = ref<BackendFileItem[]>([])
    const basePath = ref('/')
    const isLoading = ref(false)
    const musicStore = useMusicStore()

    const handleRefresh = async () => {
      try {
        isLoading.value = true
        if (!basePath.value) {
          basePath.value = '/'
        }
        const res = await getList({
          path: basePath.value,
          getPlayStat: true,
        })
        const list = res.list as BackendFileItem[]

        files.value = list
      } catch (e) {
        console.error(e)
        files.value = []
      } finally {
        isLoading.value = false
      }
    }
    const goUp = () => {
      const arr = basePath.value.split('/').filter((i) => !!i)
      console.log(arr)
      arr.pop()
      if (!arr.length) {
        basePath.value = '/'
        handleRefresh()
        return
      }
      basePath.value = '/' + arr.join('/') + '/'
      handleRefresh()
    }

    onMounted(() => {
      handleRefresh()
    })

    const handleCreateFile = () => {
      // fs.writeFile(
      //   basePath.value + `test_${Date.now()}.txt`,
      //   `Cool, I can do this in the browser!\nDate: ${new Date()}`,
      //   function (err) {
      //     if (err) {
      //       throw err
      //     }
      //   }
      // )
      handleRefresh()
    }
    const handleCreateFolder = () => {
      // fs.mkdirSync(basePath.value + `folder_${Date.now()}`)
      // handleRefresh()
    }

    const handleOpenFile = (item: BackendFileItem) => {
      musicStore.playFromFiles(item, files.value)
    }

    const handleFileAction = (type: string, item: BackendFileItem, index: number) => {
      if (type === 'open') {
        if (item.isDirectory) {
          basePath.value += item.filename + '/'
          handleRefresh()
          return
        } else {
          handleOpenFile(item)
        }
        return
      }
      if (type === 'rename') {
        const newName = prompt('input new path', item.filename)
        if (!newName) {
          return
        }
        // fs.renameSync(basePath.value + item.filename, basePath.value + newName)
        handleRefresh()
        return
      }
      if (type === 'delete') {
        const path = basePath.value + item.filename
        if (item.isDirectory) {
          // deleteFolderRecursiveSync(path)
        } else {
          // fs.unlinkSync(path + item.filename)
        }
        handleRefresh()
      }
    }
    return {
      files,
      basePath,
      handleRefresh,
      goUp,
      handleCreateFile,
      handleCreateFolder,
      handleFileAction,
      formatDate,
      isLoading,
      bytesToSize,
    }
  },
})
</script>

<template>
  <div class="explorer-wrap">
    <div class="explorer-header">
      <div class="nav-address">
        <div class="nav-wrap">
          <button class="btn-action" @click="handleCreateFile">+ File</button>
          <button class="btn-action" @click="handleCreateFolder">+ Folder</button>
          <!--          <button class="btn-action">Back</button>-->
          <!--          <button class="btn-action">Forward</button>-->
          <button class="btn-action" @click="goUp">Up</button>
        </div>
        <div class="input-wrap">
          <input
            placeholder="Path"
            v-model="basePath"
            class="input-addr"
            @keyup.enter="handleRefresh"
          />
          <button class="btn-refresh btn-action" @click="handleRefresh">Refresh</button>
        </div>
      </div>
    </div>
    <div class="explorer-content _scrollbar_mini">
      <n-space align="center" justify="center" v-show="isLoading">
        <n-spin />
      </n-space>
      <div v-show="!isLoading" class="file-list">
        <div class="file-list-header file-list-row">
          <div class="list-col c-icon">icon</div>
          <div class="list-col c-filename">filename</div>
          <!--          <div class="list-col c-type">type</div>-->
          <div class="list-col c-size">size</div>
          <div class="list-col c-time">birthtime</div>
          <div class="list-col c-actions">actions</div>
        </div>
        <div
          v-for="(item, index) in files"
          :key="item.id"
          class="file-list-item file-list-row"
          @dblclick="handleFileAction('open', item, index)"
        >
          <div class="list-col c-icon">
            <abbr :title="JSON.stringify(item, null, 2)">
              {{ item.isDirectory ? '[目录]' : '[文件]' }}
            </abbr>
          </div>
          <div class="list-col c-filename">
            {{ item.filename }}
          </div>
          <!--          <div class="list-col c-type">type</div>-->
          <div class="list-col c-size">{{ bytesToSize(item.size) }}</div>
          <div class="list-col c-time">{{ formatDate(item.birthtime) }}</div>
          <div class="list-col c-actions">
            <button @click.stop="handleFileAction('open', item, index)">
              {{ item.isDirectory ? 'Open' : 'Read' }}
            </button>
            <button @click.stop="handleFileAction('rename', item, index)">Rename</button>
            <button @click.stop="handleFileAction('delete', item, index)">Delete</button>
          </div>
        </div>

        <div v-if="!files.length" style="text-align: center; padding: 50px">
          This folder is empty
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.explorer-wrap {
  //box-shadow: 0 1px 10px rgba(0, 0, 0, 0.27), inset 0 0 0.5px #fff;
  //border: 1px solid rgba(0, 0, 0, 0.4);
  max-width: 1000px;
  min-width: 100px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  .explorer-header {
    padding: 0 5px;
    .nav-address {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;

      .nav-wrap {
        margin-right: 10px;
      }

      .input-wrap {
        display: flex;
        align-items: center;
        flex: 1;

        .input-addr {
          flex: 1;
        }

        .btn-refresh {
          margin-left: 10px;
        }
      }
    }
  }
  .explorer-content {
    flex: 1;
    overflow: auto;
    position: relative;
  }

  .btn-action {
    padding: 2px 10px;

    & + .btn-action {
      margin-left: 5px;
    }
  }

  .file-list {
    .file-list-header {
      font-weight: bold;
      text-transform: capitalize;
      border-bottom: 1px solid #7c7c7c;
      position: sticky;
      top: 0;
      background-color: rgba(206, 206, 206);
      color: black;
      padding: 0 !important;
    }

    .file-list-row {
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .list-col {
        padding: 0 5px;
        &.c-icon {
          padding-left: 10px;
          width: 50px;
        }

        &.c-filename {
          flex: 1;
        }

        &.c-type {
          width: 100px;
        }

        &.c-size {
          width: 80px;
        }

        &.c-time {
          width: 150px;
        }

        &.c-actions {
          text-align: right;
          width: 220px;
          padding-right: 10px;
          button + button {
            margin-left: 5px;
          }
        }
      }
    }

    .file-list-item {
      &:hover {
        background-color: rgba(131, 131, 131, 0.226);
      }

      & + .file-list-item {
        border-top: 1px solid $color_border;
      }
    }
  }
}
</style>
