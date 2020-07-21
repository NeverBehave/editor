import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import state from './state'

Vue.use(Vuex)

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
  state,
  mutations,
  actions,
  getters: {
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
  },
  modules: {}
})
