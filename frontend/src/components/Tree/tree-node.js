import {IncreaseNumber} from '@/utils'

const n = new IncreaseNumber()

const linkParent = (nodes, parent) => {
  nodes.forEach(n => n.parent = parent)
}
const unlinkParent = (nodes) => {
  nodes.forEach(n => n.parent = null)
}

// 封装树节点
export default class TreeNode {
  constructor(params) {
    this.id = params.id || n.get()
    this.title = params.title || ''
    this.isLazy = params.isLazy || false
    this.isOpen = params.isOpen || false
    this.isLoading = params.isLoading || false
    this.children = null // []
    this.parent = null // TreeNode
    this.data = params.data || {} // Custom data
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
        linkParent(children, this)
        this.children = children
        // this.$set(this, 'children', children)
        // this.children = reactive(children)
        this.isOpen = true
        this.isLoading = false
        this.isLazy = false
      },
      fail: (err) => {
        console.error('lazyLoad fail', err)
        this.isLoading = false
      }
    }
  }

  prependChild(node) {
    node.parent = this
    if (!this.children) {
      this.children = [node]
      return
    }
    this.children.unshift(node)
  }
  appendChild(node) {
    node.parent = this
    if (!this.children) {
      this.children = [node]
      return
    }
    this.children.push(node)
  }

  prependChildren(list) {
    if (!list) {
      return
    }
    linkParent(list, this)
    this.children = [...list, ...(this.children || [])]
  }
  appendChildren(list) {
    if (!list) {
      return
    }
    linkParent(list, this)
    this.children = [...(this.children || []), ...list]
  }

  removeChild(child, replace) {
    if (!this.children) {
      return false
    }

    const index = this.children.findIndex(i => i.id === child.id)
    if (index > -1) {
      child.parent = null
      if (replace) {
        this.children.splice(index, 1, replace)
      } else {
        this.children.splice(index, 1)
      }
      return true
    }
    return false
  }
  removeChildren() {
    unlinkParent(this.children)
    this.children = []
  }
}
