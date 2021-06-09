import {IncreaseNumber} from '@/utils'

const n = new IncreaseNumber()

// 封装树节点
export default class TreeNode {
  constructor(params) {
    this.id = params.id || n.get()
    this.title = params.title || ''
    this.isLazy = params.isLazy || false
    this.isOpen = params.isOpen || false
    this.isLoading = params.isLoading || false
    this.data = params.data || {} // Custom data
    this.children = null
    this.parents = []
  }

  /**
   * 处理异步加载的数据
   * node 节点
   * key 节点 id
   * done 异步加载成功后回调，传入 children 数组
   * fail 异步加载失败后回调
   * @returns {{node: Object, fail: fail, done: done, key: *}}
   */
  lazyLoad() {
    return {
      node: this,
      key: this.id,
      done: (children) => {
        this.children = children
        // this.$set(this, 'children', children)
        // this.children = reactive(children)
        this.isOpen = true
        this.isLoading = false
        this.isLazy = false
      },
      fail: () => {
        console.error('lazyLoad fail')
        this.isLoading = false
      }
    }
  }
}
