// e = ref.current

export function getElementCenterPosition(e) {
  const leftTop = getElementPositon(e);
  const dim = getElementDimensions(e);
  const x = leftTop.x + 0.5 * dim.width;
  const y = leftTop.y + 0.5 * dim.heigth;
  return { x: x, y: y };
}

export function getElementDimensions(e) {
  const width = e.offsetWidth;
  const heigth = e.offsetHeight;
  return { width, heigth };
}

export function getElementPositon(e) {
  const x = e.offsetLeft;
  const y = e.offsetTop;
  return { x: x, y: y };
}

export function getLineCenterXY(p1, p2, length, thickness) {
  const sumX = p1.x + p2.x;
  const sumY = p1.y + p2.y;
  const x = 0.5 * (sumX - length);
  const y = 0.5 * (sumY - thickness);
  return { x: x, y: y };
}

export function getDistanceXY(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getAngleXY(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}
