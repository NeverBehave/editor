import Vue from 'vue'
import Vuex from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash'
Vue.use(Vuex)

/**
 * nodes: {
 *  uuid: {
 *   name: hello,
 *   inputs: [],
 *   outputs: [],
 *    position: {x: y: }
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
 * }
 */

export default new Vuex.Store({
  state: {
    nodes: {
      uuid: { name: 'hello', position: { x: 0, y: 0 }, inputs: ['uuid2'] },
      uuid1: { name: 'hello1', position: { x: 15, y: 24 }, outputs: ['uuid3'] }
    },
    connections: {
      uuid4: {
        from: 'uuid3',
        to: 'uuid2'
      }
    },
    sockets: {
      uuid2: {
        name: 'hello',
        type: 'string',
        parent: 'uuid',
        ioType: 'input',
        connections: ['uuid4'],
        position: {
          x: 0, y: 0
        }
      },
      uuid3: {
        name: 'hello',
        type: 'string',
        parent: 'uuid1',
        ioType: 'output',
        connections: ['uuid4'],
        position: {
          x: 0, y: 0
        }
      }
    },
    errors: {},
    config: {
      scale: 1,
      transform: {
        x: 0,
        y: 0
      },
      intensity: 0.1
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
      selectedSocket: []
    }
  },
  mutations: {
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
        state.nodes,
        uuid,
        cloneDeep({
          ...state.nodes[uuid],
          ...node
        })
      )
    },
    updateConnection (state, { uuid, connection }) {
      Vue.set(
        state.connections,
        uuid,
        cloneDeep({
          ...state.connections[uuid],
          ...connection
        })
      )
    },
    updateSocket (state, { uuid, socket }) {
      Vue.set(
        state.sockets,
        uuid,
        cloneDeep({
          ...state.sockets[uuid],
          ...socket
        })
      )
    },
    addNodeInput (state, { uuid, input }) {
      state.nodes[uuid].inputs.push(input)
    },
    addNodeOutput (state, { uuid, output }) {
      state.nodes[uuid].outputs.push(output)
    },
    addSocketConnection (state, { uuid, connection }) {
      state.sockets[uuid].connections.push(connection)
    },
    removeNodeInput (state, { uuid, input }) {
      const index = state.nodes[uuid].inputs.indexOf(input)
      index !== -1 && state.nodes[uuid].inputs.splice(index, 1)
    },
    removeNodeOutput (state, { uuid, output }) {
      const index = state.nodes[uuid].outputs.indexOf(output)
      index !== -1 && state.nodes[uuid].outputs.splice(index, 1)
    },
    removeSocketConnection (state, { uuid, connection }) {
      const index = state.sockets[uuid].connections.indexOf(connection)
      index !== -1 && state.sockets[uuid].connections.splice(index, 1)
    },
    removeNode (state, { uuid }) {
      Vue.delete(state.nodes, uuid)
    },
    removeConnection (state, { uuid }) {
      Vue.delete(state.connections, uuid)
    },
    removeSocket (state, { uuid }) {
      Vue.delete(state.sockets, uuid)
    },
    emitResize (state) {
      state.status.resize = !state.status.resize
    }
  },
  actions: {
    async addNode ({ commit }, { node }) {
      const uuid = uuidv4()
      commit('updateNode', { uuid, node })

      return uuid
    },
    async createConnection ({ commit }, { connection }) {
      const uuid = uuidv4()
      commit('updateConnection', { uuid, connection })
      return uuid
    },
    async addConnection ({ commit, dispatch }, { from, to, connection }) {
      const uuid = await dispatch('createConnection', { connection })
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
      commit('addNodeInput', { uuid, sid })

      return sid
    },
    async addNodeOutput ({ commit, dispatch }, { uuid, output }) {
      const o = { ...output, parent: uuid, ioType: 'output' }
      const sid = await dispatch('createSocket', { socket: o })
      commit('addNodeOutput', { uuid, sid })

      return sid
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
      commit('removeNode', uuid)
    }
  },
  getters: {
    getConnection: (state) => (uuid) => state.connections[uuid],
    getConnections: (state) => state.connections,
    getSocket: (state) => (uuid) => state.sockets[uuid],
    getSockets: (state) => state.sockets,
    getNode: (state) => (uuid) => state.nodes[uuid],
    getNodes: (state) => state.nodes,
    getScale: (state) => state.config.scale,
    getZoom: (state) => state.status.zoom,
    getDrag: (state) => state.status.drag,
    // isTranslating: (state) => state.status.translate,
    getEditorTransform: (state) => state.config.transform,
    getIntensity: (state) => state.config.intensity,
    eventResize: (state) => state.status.resize
  },
  modules: {}
})
