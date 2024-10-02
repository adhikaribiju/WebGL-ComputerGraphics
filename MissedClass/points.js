var VSHADER_SOURCE = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
    gl_PointSize = 10.0;
  }
`;

var FSHADER_SOURCE = `
  void main () {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

function main() {
  const canvas = document.getElementById("glcanvas");
  gl = getWebGLContext(canvas);

  if (gl === null) {
    alert("Unable to support WebGL on your machine.");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    alert("Error: initShader");
    return;
  }

  var n = myinitVertexBuffer(gl);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS, 0, n);
}

function myinitVertexBuffer(gl) {
  var vertices = new Float32Array([-0.5, 0.5]);
  var n = 1;

  //pipeline
  var VertexBuffer = gl.createBuffer();

  if (!VertexBuffer) {
    console.log("Failed to create buffer");
    return -1;
  }

  //bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);

  //send data
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  //attribute - pipeline
  x = gl.getAttribLocation(gl.program, "a_position");

  //vertex attrib pointer
  gl.vertexAttribPointer(x, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(x);

  return n;
}
