
function main() {
  const canvas = document.getElementById("glcanvas");
  const gl = getWebGLContext(canvas);

  if (gl === null) {
    alert("Unable to support WebGL on your machine.");
    return;
  }

  gl.clearColor(0.0, 0.5, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

main();
