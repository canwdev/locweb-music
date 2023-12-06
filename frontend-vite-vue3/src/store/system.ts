import {TaskItem} from '@/enum/os'

interface IStore {
  tasks: TaskItem[]
  activeId: string
}

export const useSystemStore = defineStore('system', {
  state: (): IStore => {
    return {
      tasks: [],
      activeId: '',
    }
  },
  actions: {
    createTask() {
      const newTask = new TaskItem({
        title: 'New Task',
        icon: '',
      })
      this.tasks = [...this.tasks, newTask]
      this.activeId = newTask.guid
    },
    closeTask(guid) {
      const _tasks = [...this.tasks]
      const idx = _tasks.findIndex((i) => i.guid === guid)

      _tasks.splice(idx, 1)
      this.tasks = _tasks

      // 上一个应用的index
      let lastIdx = idx - 1
      if (!_tasks[lastIdx]) {
        // 如果不存在则设置为最后一个
        lastIdx = _tasks.length - 1
        if (!_tasks[lastIdx]) {
          lastIdx = -1
        }
      }
      if (lastIdx > -1) {
        this.setTaskActive(_tasks[lastIdx])
      }
    },
    setTaskActive(task: TaskItem) {
      this.activeId = task.guid
      if (task.windowRef) {
        task.windowRef.setActive()
      }
    },
  },
})
