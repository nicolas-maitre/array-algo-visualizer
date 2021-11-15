export function reqAnimFrame() {
  return new Promise((res) => {
    requestAnimationFrame(res);
  });
}
export function reqTimeout() {
  return new Promise((res) => {
    setTimeout(res);
  });
}
