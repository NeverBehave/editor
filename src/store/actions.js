import { v4 as uuidv4 } from 'uuid'

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

const newSocket = () => {
  return {
    name: 'hello',
    type: 'unknown',
    parent: 'uuid',
    ioType: 'unknown',
    connections: [],
    position: { x: 0, y: 0 }
  }
}

export default {
  // Helpers
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
  async createSocket ({ commit }, { socket }) {
    const uuid = uuidv4()
    commit('updateSocket', {
      uuid,
      socket: {
        ...newSocket(),
        ...socket
      }
    })
    return uuid
  },
  // Main Methods
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
  async addNodeInput ({ commit, dispatch }, { uuid, input }) {
    const i = { ...input, parent: uuid, ioType: 'input' }
    const sid = await dispatch('createSocket', { socket: i })
    commit('addNodeInput', { uuid, input: sid })

    return sid
  },
  async addNodeOutput ({ commit, dispatch }, { uuid, output }) {
    const o = { ...output, parent: uuid, ioType: 'output' }
    const sid = await dispatch('createSocket', { socket: o })
    commit('addNodeOutput', { uuid, output: sid })

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
    commit('removeNode', { uuid })
    await Promise.all([
      ...n.inputs.map(e => dispatch('removeSocket', { uuid: e })),
      ...n.outputs.map(e => dispatch('removeSocket', { uuid: e }))
    ])
    n.controls.forEach(e => commit('removeControl', { uuid: e }))
  },
  async cloneNode ({ getters, commit, dispatch }, { uuid, position = { x: 0, y: 0 } }) {
    const n = getters.getNode(uuid)

    const nodeId = await dispatch('addNode', {
      node: {
        ...n,
        inputs: [],
        outputs: [],
        controls: [],
        position
      }
    })

    await Promise.all([
      ...n.inputs.map(e => dispatch('addNodeInput', {
        uuid: nodeId,
        input: {
          ...e,
          connections: [],
          position: null
        }
      })),
      ...n.outputs.map(e => dispatch('addNodeOutput', {
        uuid: nodeId,
        output: {
          ...e,
          connections: [],
          position: null
        }
      }))
    ])
    n.controls.forEach(e => commit('addNodeControl', { uuid: nodeId, control: e }))

    return nodeId
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
  },
  async updateEditorZoom ({ commit, getters }, { x, y, scale }) {
    const { maxScale, minScale } = getters.getMaxTransform
    const { x: originalX, y: originalY, scale: originalScale } = getters.getEditorTransform
    const updatedScale = scale < minScale ? minScale : scale > maxScale ? maxScale : scale
    const d = (originalScale - updatedScale) / ((originalScale - scale) || 1)

    commit('updateEditorTransform', {
      x: originalX + x * d, y: originalY + y * d, scale: updatedScale || 1
    })
  },
  async updateEditorTransform ({ getters, commit }, { x, y }) {
    const { width, height } = getters.getMaxTransform
    const { scale } = getters.getEditorTransform
    const [kw, kh] = [width * scale, height * scale]
    const cx = getters.getEditorSize.width / 2
    const cy = getters.getEditorSize.height / 2
    let updatedX = x - cx
    let updatedY = y - cy
    updatedX = updatedX > kw ? kw : updatedX < -kw ? -kw : updatedX
    updatedY = updatedY > kh ? kh : updatedY < -kh ? -kh : updatedY
    updatedX += cx
    updatedY += cy

    commit('updateEditorTransform', {
      x: updatedX, y: updatedY
    })
  },
  async addNodeFromComponent ({ dispatch, getters }, { component, position = { x: 0, y: 0 }, followMouse = false }) {
    const com = typeof component === 'string' ? getters.getComponent(component) : component
    if (com) {
      const nodeId = await dispatch('addNode', {
        node: {
          ...newNode(),
          type: com.type,
          name: com.name,
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
  // Events
  async emitContextMenu ({ commit, getters }, { type, uuid }) {
    const { x, y } = getters.getMouse
    commit('emitContextMenu', {
      type, uuid, x, y
    })
  }
}
