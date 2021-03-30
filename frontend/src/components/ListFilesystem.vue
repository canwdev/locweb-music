<template>
  <div class="list-file-system">
    <MainList
        :is-loading="isLoading"
        :list="fileList"
        :show-up="directories.length > 0"
        :active-id="lastPlayIndex"
        :min-item-size="40"
        @onItemClick="handleItemClick"
        @onItemAction="handleItemAction"
        @goUpDir="goUpDir"
        @refresh="getFileList"
    />
    <ModalDialog
        v-model:visible="actionDialogVisible"
    >
      <ListMenu
          :list="menuList"
      />
    </ModalDialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted
} from 'vue';
import store from '@/store'
import {useRoute} from 'vue-router'
import router from '@/router'
import {MusicItem} from "@/enum"
import {getList} from "@/api/music"
import {isSupportedMusicFormat} from "@/utils/is";
import bus, {
  ACTION_PLAY_START,
} from "@/utils/bus";
import MainList from "@/components/MainList/index.vue";
import ModalDialog from '@/components/ModalDialog.vue'
import ListMenu from '@/components/ListMenu.vue'

export default defineComponent({
  name: "ListFilesystem",
  components: {
    MainList,
    ModalDialog,
    ListMenu
  },
  setup() {
    const route = useRoute()
    const isLoading = ref<boolean>(false)
    const lastPlayIndex = ref(-1)
    const directories = ref<Array<any>>([])
    const fileList = ref<Array<MusicItem>>([])

    const getFileList = async () => {
      if (isLoading.value) {
        return
      }
      try {
        isLoading.value = true
        lastPlayIndex.value = -1

        let path = ''
        directories.value.forEach((item: any) => {
          path += (item.filename + '/')
        })

        const {list, playStat} = await getList({
          path,
          getPlayStat: true
        })
        const lastFilename = playStat && playStat.file
        fileList.value = list.map((file, index) => {
          if (lastFilename && (file.filename === lastFilename)) {
            lastPlayIndex.value = index
          }
          return new MusicItem(file)
        })

      } catch (e) {
        window.$swal.fire({
          toast: true,
          icon: 'error',
          title: e.message,
          showConfirmButton: false,
        })
        console.error(e)
      } finally {
        isLoading.value = false
      }

    }

    watch(() => route.query, (val) => {
      const dir = val.dir
      if (dir) {
        // @ts-ignore
        const list = JSON.parse(dir).map(item => new MusicItem({
          filename: item,
          isDirectory: true
        }))
        directories.value = list
        // console.log('router.query.dir change', val)
      }
    }, {
      immediate: true
    })

    watch(directories, (val) => {
      // console.log('directories changed', {val, router, route})

      router.push({
        query: {
          ...route.query,
          dir: JSON.stringify(val.map(item => item.filename))
        }
      })
      getFileList()
    }, {
      deep: true
    })

    const goUpDir = () => {
      directories.value.pop()
    }

    const handleItemClick = (item: MusicItem) => {
      // jump folder
      if (item.isDirectory) {
        directories.value.push(item)
        return
      }

      if (isSupportedMusicFormat(item.filename)) {
        store.commit('clearShuffle')
        // format data
        const list = fileList.value.filter((val: any) => {
          return isSupportedMusicFormat(val.filename)
        })
        store.commit('setPlayingList', list)
        // set current playing
        // playMusicFromList(list, item)
        bus.emit(ACTION_PLAY_START, {list, item})
        lastPlayIndex.value = item.id
      } else {
        window.$swal.fire({
          toast: true,
          width: 300,
          timer: 2500,
          icon: 'info',
          title: 'Format not support.',
          showConfirmButton: true,
          confirmButtonText: 'Try'
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(item.getSource(), '_blank')
          }
        })
      }
    }

    const actionDialogVisible = ref<boolean>(false)
    const selectedItem = ref<MusicItem | null>(null)
    const handleItemAction = (item: MusicItem) => {
      actionDialogVisible.value = true
      selectedItem.value = item
    }
    watch(actionDialogVisible, (val) => {
      if (!val) {
        selectedItem.value = null
      }
    })

    const handleRename = () => {
      if (!selectedItem.value) return
      const newName = prompt('Rename', selectedItem.value.filename)
      console.log('Rename', newName)
      actionDialogVisible.value = false
    }

    const menuList = [
      {label: 'Rename', action: handleRename},
      {label: 'Delete'},
      {label: 'Replace'},
    ]

    onMounted(() => {
      getFileList()
    })

    return {
      isLoading,
      fileList,
      lastPlayIndex,
      directories,
      getFileList,
      goUpDir,
      handleItemClick,
      handleItemAction,
      actionDialogVisible,
      menuList
    }
  }
})
</script>

<style scoped>

</style>