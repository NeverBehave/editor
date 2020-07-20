// require contextment => contextmenuContextMenu

export default {
  methods: {
    nodeContextMenu ({ e, node }) {
      const [x, y] = [e.clientX, e.clientY]

      if (node) {
        menu = new NodeMenu(editor, { searchBar: false, delay }, vueComponent, isFunction(nodeItems) ? nodeItems(node) : nodeItems)
        menu.show(x, y, { node })
      }
    }
  }
}
