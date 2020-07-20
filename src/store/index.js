import Vue from 'vue'
import Vuex from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash'
Vue.use(Vuex)

const newNode = () => {
  return {
    name: '',
    type: '',
    inputs: [],
    outputs: [],
    controls: [],
    data: {},
    position: { x: 0, y: 0 }
  }
}
// Structure for component:
/**
 * config: {
      scale: 1,
      transform: {
        x: 0,
        y: 0
      },
      intensity: 0.1,
      components: {
        uuid:  {
          name: 'default name',
          type: 'component',
          controls: [{ type, data }], // data here are actually used for init, the rest of the time, data should fetch directly from node.
          inputs: [{ ...socket {name, type}}],
          outputs: []
        }
      }
    },
 * nodes: {
 *  uuid: {
 *   name: hello,
 *   type: 'component_name',
 *   inputs: [],
 *   outputs: [],
 *   controls: [],
 *   data: {},
 *   position: {x: y: }
 *  }
 * },
 * sockets: {
 *  uuid: {
 *   name: hello,
 *   type: string,
 *   parent: uuid,
 *   ioType: 'input'/'output',
 *   connections: [],
 *   position: {}
 *  }
 * },
 *  connections: {
 *  uuid: {
 *   from: uuid,
 *   to: uuid
 *   path?: ''
 *  }
 * },
 * controls: {
 *  uuid: {
 *    parent: uuid,
 *    name: 'component-name'
 *  }
 * },
 * errors: {
 *  uuid: {
 *  parent: uuid,
 *  message: message
 * }
 * }
 */

// uuid2: {
//   name: 'hello',
//   type: 'string',
//   parent: 'uuid',
//   ioType: 'input',
//   connections: ['uuid4'],
//   position: {
//     x: 0, y: 0
//   }
// },
// uuid3: {
//   name: 'hello',
//   type: 'string',
//   parent: 'uuid1',
//   ioType: 'output',
//   connections: ['uuid4'],
//   position: {
//     x: 0, y: 0
//   }
// }
//   uuid: { name: 'hello', position: { x: 0, y: 0 }, inputs: ['uuid2'] },
// uuid1: { name: 'hello1', position: { x: 15, y: 24 }, outputs: ['uuid3'] }
// uuid: { name: 'hello', position: { x: 0, y: 0 }, inputs: ['uuid2'] },
// uuid1: { name: 'hello1', position: { x: 15, y: 24 }, outputs: ['uuid3'] }
//  uuid4: {
//   from: 'uuid3',
//   to: 'uuid2'
// }
export default new Vuex.Store({
  state: {
    graph: {
      nodes: {},
      connections: {},
      sockets: {},
      controls: {},
      errors: {}
    },
    config: {
      scale: 1,
      transform: {
        x: 0,
        y: 0
      },
      intensity: 0.1,
      components: {
        uuid: {
          name: 'input node',
          type: 'input node',
          controls: [{ type: 'controlInput', data: { hello: 'world' } }],
          inputs: [{ name: 'test', type: 'string' }],
          outputs: []
        }
      }
    },
    status: {
      zoom: false,
      resize: false,
      // translate: false,
      mouse: {
        x: 0,
        y: 0
      },
      selectedNodes: [],
      selectedSocket: null,
      pseudo: {}
    }
  },
  mutations: {
    updateSelectedSocket (state, { uuid }) {
      state.status.selectedSocket = uuid
    },
    updateMouse (state, { position }) {
      state.status.mouse = {
        ...state.status.mouse,
        ...position
      }
    },
    updateEditorTransform (state, pair) { // { x, y }
      state.config.transform = {
        ...state.config.transform,
        ...pair
      }
    },
    updateEditorScale (state, { scale }) {
      state.config.scale = scale
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
  },
  actions: {
    async addNodeFromComponent ({ dispatch, getters }, { component, position = { x: 0, y: 0 }, followMouse = false }) {
      const com = typeof component === 'string' ? getters.getComponent(component) : component
      if (com) {
        const nodeId = await dispatch('addNode', {
          node: {
            ...newNode(),
            type: com.type,
            position: followMouse ? getters.getMouse : position
          }
        })

        com.inputs.forEach(e => dispatch('addNodeInput', { uuid: nodeId, input: e }))
        com.outputs.forEach(e => dispatch('addNodeOutput', { uuid: nodeId, output: e }))
        com.controls.forEach(e => dispatch('addNodeControl', { uuid: nodeId, control: e }))

        return nodeId
      }

      return false
    },
    async addNode ({ commit }, { node }) {
      const uuid = uuidv4()
      commit('updateNode', { uuid, node })

      return uuid
    },
    async addControl ({ commit }, { control }) {
      const uuid = uuidv4()
      commit('updateControl', { uuid, control })

      return uuid
    },
    async createConnection ({ commit }, { connection }) {
      const uuid = uuidv4()
      commit('updateConnection', { uuid, connection })
      return uuid
    },
    async addConnection ({ commit, dispatch }, { from, to, connection }) {
      const uuid = await dispatch('createConnection', {
        connection: {
          from,
          to,
          ...connection
        }
      })
      // update from/to
      commit('addSocketConnection', { uuid: from, connection: uuid })
      commit('addSocketConnection', { uuid: to, connection: uuid })

      return uuid
    },
    async createSocket ({ commit }, { socket }) {
      const uuid = uuidv4()
      commit('updateSocket', { uuid, socket })
      return uuid
    },
    async addNodeInput ({ commit, dispatch }, { uuid, input }) {
      const i = { ...input, parent: uuid, ioType: 'input' }
      const sid = await dispatch('createSocket', { socket: i })
      commit('addNodeInput', { uuid, input: sid })

      return sid
    },
    async addNodeOutput ({ commit, dispatch }, { uuid, output }) {
      const o = { ...output, parent: uuid, ioType: 'output' }
      const sid = await dispatch('createSocket', { socket: o })
      commit('addNodeOutput', { uuid, sid })

      return sid
    },
    async addNodeControl ({ dispatch, commit }, { uuid, control }) {
      const { type, data } = control
      const c = { type, parent: uuid }
      // mix data field into node data field
      const cid = await dispatch('addControl', { control: c })
      commit('updateNodeData', { uuid, data })
      commit('addNodeControl', { uuid, control: cid })

      return cid
    },
    async removeConnection ({ getters, commit }, { uuid }) {
      const conn = getters.getConnection(uuid)
      const { from, to } = conn
      commit('removeSocketConnection', { uuid: from, connection: uuid })
      commit('removeSocketConnection', { uuid: to, conneection: uuid })
      commit('removeConnection', { uuid })
    },
    async removeSocket ({ getters, commit, dispatch }, { uuid }) {
      const s = getters.getSocket(uuid)
      await Promise.all(s.connections.map(e => dispatch('removeConnection', { uuid: e })))
      commit('removeSocket', { uuid })
    },
    async removeNode ({ getters, commit, dispatch }, { uuid }) {
      const n = getters.getNode(uuid)
      await Promise.all([
        ...n.inputs.map(e => dispatch('removeSocket', e)),
        ...n.outputs.map(e => dispatch('removeSocket', e))
      ])
      n.controls.forEach(e => commit('removeControl', { uuid: e }))
      commit('removeNode', uuid)
    },
    async socketClicked ({ getters, commit, dispatch }, { uuid }) {
      const prevSocket = getters.getSelectedSocket
      if (prevSocket) {
        if (prevSocket !== uuid) {
          const prev = getters.getSocket(prevSocket)
          const cur = getters.getSocket(uuid)
          if (prev.ioType !== cur.ioType) {
            if (prev.ioType === 'input') {
              dispatch('addConnection', { from: uuid, to: prevSocket })
            } else {
              dispatch('addConnection', { from: prevSocket, to: uuid })
            }
          }
        }
        commit('updateSelectedSocket', { uuid: null })
      } else {
        commit('updateSelectedSocket', { uuid })
      }
    }
  },
  getters: {
    getConnection: (state) => (uuid) => state.graph.connections[uuid],
    getConnections: (state) => state.graph.connections,
    getSocket: (state) => (uuid) => state.graph.sockets[uuid],
    getSockets: (state) => state.graph.sockets,
    getNode: (state) => (uuid) => state.graph.nodes[uuid],
    getNodes: (state) => state.graph.nodes,
    getControl: (state) => (uuid) => state.graph.controls[uuid],
    getScale: (state) => state.config.scale,
    getZoom: (state) => state.status.zoom,
    getDrag: (state) => state.status.drag,
    getMouse: (state) => state.status.mouse,
    getSelectedSocket: (state) => state.status.selectedSocket,
    getComponents: (state) => state.config.components,
    getComponent: (state) => (uuid) => state.config.components[uuid],
    // isTranslating: (state) => state.status.translate,
    getEditorTransform: (state) => state.config.transform,
    getIntensity: (state) => state.config.intensity,
    eventResize: (state) => state.status.resize
  },
  modules: {}
})
