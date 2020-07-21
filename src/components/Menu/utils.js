export function fitViewport ({ x, y }, element) {
  return {
    x: Math.min(x, window.innerWidth - element.clientWidth),
    y: Math.min(y, window.innerHeight - element.clientHeight)
  }
}
