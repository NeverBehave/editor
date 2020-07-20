export default {
  graph: {
    nodes: {},
    connections: {},
    sockets: {},
    controls: {},
    errors: {}
  },
  config: {
    transform: {
      x: 0,
      y: 0,
      scale: 1
    },
    maxTransform: {
      width: 5000,
      height: 4000,
      maxScale: 2,
      minScale: 0.1
    },
    intensity: 0.1,
    components: {
      uuid: {
        name: 'Untitled input node',
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
    mouse: {
      x: 0,
      y: 0
    },
    size: {
      height: 0,
      width: 0
    },
    selectedNodes: [],
    selectedSocket: null
  }
}
