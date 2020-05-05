let lastEventType = ''
export const findClosestDot = (e, G, dots) => {
  // because on a simple tap both touchend and mouseup will be triggered and cause issues
  if (e.type === 'touchend' && lastEventType !== 'touchmove') return null
  lastEventType = e.type

  const rect = document.getElementById('cad').getBoundingClientRect()
  const { clientX } = e.clientX ? e : e.changedTouches[0]
  const { clientY } = e.clientY ? e : e.changedTouches[0]
  const x = (clientX - rect.left) / rect.width
  const y = (clientY - rect.top) / rect.height
  const xIndex = Math.floor(x * G - 1 / 2)
  const yIndex = Math.floor(y * G - 1 / 2)

  const isInRange = index => index >= 0 && index < G - 1

  if (isInRange(xIndex) && isInRange(yIndex)) {
   return dots.find((dot) => dot.x === xIndex && dot.y === yIndex)
  }
  return null
}