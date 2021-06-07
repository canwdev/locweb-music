import {guid} from '../../utils'

// 封装树节点
export default class TreeNode {
  constructor(data) {
    Object.assign(this, {
      id: guid(), // 唯一标识符id
      name: 'root', // 节点显示名称
      lazy: false, // 如果为 true 则点击会触发 onItemLazyLoad 事件处理异步加载逻辑
      isOpen: false, // 节点是否展开
      isLoading: false // 节点是否加载中
      // children: [] // 子节点数组，可以为空数组，当没有该属性且 lazy=false 时，是一个文件
    })
    Object.assign(this, data)
  }
}
