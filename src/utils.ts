export function reqAnimFrame() {
  return new Promise((res) => {
    requestAnimationFrame(res);
  });
}
export function reqTimeout(time?: number) {
  return new Promise((res) => {
    setTimeout(res, time);
  });
}
