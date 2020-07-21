export default {
  getConnection: (state) => (uuid) => state.graph.connections[uuid],
  getConnections: (state) => state.graph.connections,
  getSocket: (state) => (uuid) => state.graph.sockets[uuid],
  getSockets: (state) => state.graph.sockets,
  getNode: (state) => (uuid) => state.graph.nodes[uuid],
  getNodes: (state) => state.graph.nodes,
  getControl: (state) => (uuid) => state.graph.controls[uuid],
  getZoom: (state) => state.status.zoom,
  getDrag: (state) => state.status.drag,
  getMouse: (state) => state.status.mouse,
  getSelectedSocket: (state) => state.status.selectedSocket,
  getComponents: (state) => state.config.components,
  getComponent: (state) => (uuid) => state.config.components[uuid],
  getEditorTransform: (state) => state.config.transform,
  getIntensity: (state) => state.config.intensity,
  eventResize: (state) => state.status.resize,
  getMaxTransform: (state) => state.config.maxTransform,
  getEditorSize: (state) => state.status.size,
  eventContextMenu: (state) => state.status.contextMenu,
  eventClick: (state) => state.status.click
}