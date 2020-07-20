import Vue from 'vue'
import { cloneDeep } from 'lodash'

export default {
  updateSelectedSocket (state, { uuid }) {
    state.status.selectedSocket = uuid
  },
  updateEditorSize (state, { size }) {
    state.status.size = {
      ...state.status.size,
      ...size
    }
  },
  updateMouse (state, { position }) {
    state.status.mouse = {
      ...state.status.mouse,
      ...position
    }
  },
  updateEditorTransform (state, pair) { // { x, y, scale }
    state.config.transform = {
      ...state.config.transform,
      ...pair
    }
  },
  updateNode (state, { uuid, node }) {
    Vue.set(
      state.graph.nodes,
      uuid,
      cloneDeep({
        ...state.graph.nodes[uuid],
        ...node
      })
    )
  },
  updateNodeData (state, { uuid, data }) {
    if (state.graph.nodes[uuid]) {
      Vue.set(state.graph.nodes[uuid], 'data', cloneDeep({
        ...state.graph.nodes[uuid].data,
        ...data
      }))
    } else { throw new Error('Unable to update undefined data') }
  },
  updateConnection (state, { uuid, connection }) {
    Vue.set(
      state.graph.connections,
      uuid,
      cloneDeep({
        ...state.graph.connections[uuid],
        ...connection
      })
    )
  },
  updateSocket (state, { uuid, socket }) {
    Vue.set(
      state.graph.sockets,
      uuid,
      cloneDeep({
        ...state.graph.sockets[uuid],
        ...socket
      })
    )
  },
  updateControl (state, { uuid, control }) {
    Vue.set(state.graph.controls, uuid, cloneDeep({
      ...state.graph.controls[uuid],
      ...control
    }))
  },
  addNodeInput (state, { uuid, input }) {
    state.graph.nodes[uuid].inputs.push(input)
  },
  addNodeOutput (state, { uuid, output }) {
    state.graph.nodes[uuid].outputs.push(output)
  },
  addNodeControl (state, { uuid, control }) {
    state.graph.nodes[uuid].controls.push(control)
  },
  addSocketConnection (state, { uuid, connection }) {
    state.graph.sockets[uuid].connections.push(connection)
  },
  removeNodeInput (state, { uuid, input }) {
    const index = state.graph.nodes[uuid].inputs.indexOf(input)
    index !== -1 && state.graph.nodes[uuid].inputs.splice(index, 1)
  },
  removeNodeOutput (state, { uuid, output }) {
    const index = state.graph.nodes[uuid].outputs.indexOf(output)
    index !== -1 && state.graph.nodes[uuid].outputs.splice(index, 1)
  },
  removeSocketConnection (state, { uuid, connection }) {
    const index = state.graph.sockets[uuid].connections.indexOf(connection)
    index !== -1 && state.graph.sockets[uuid].connections.splice(index, 1)
  },
  removeNodeControl (state, { uuid, control }) {
    const index = state.graph.sockets[uuid].controls.indexOf(control)
    index !== -1 && state.graph.sockets[uuid].controls.splice(index, 1)
  },
  removeControl (state, { uuid }) {
    Vue.delete(state.graph.controls, uuid)
  },
  removeNode (state, { uuid }) {
    Vue.delete(state.graph.nodes, uuid)
  },
  removeConnection (state, { uuid }) {
    Vue.delete(state.graph.connections, uuid)
  },
  removeSocket (state, { uuid }) {
    Vue.delete(state.graph.sockets, uuid)
  },
  emitResize (state) {
    state.status.resize = !state.status.resize
  }
}
