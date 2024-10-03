var vertices = [
    //base
    -0.5, -0.5, //top
    0.5, -0.5,
    0.5, 0.0,
    -0.5, 0.0,
    -0.5, 0.0, // roof
    0.5, 0.0,
    0.0, 0.5
];

// if you write vec2, you have to convert to vec4 because GPU only accepts vec4
//attribute vec4 a_position;
//gl_Position = vec4(a_position, 0.0, 1.0);
var VSHADER_SOURCE = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
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

    // initializing shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    alert("Error: initShader");
    return;
  }

  if (gl === null) {
    alert("Unable to support WebGL on your machine.");
    return;
  }

  // Buffer code
var VertexBuffer = gl.createBuffer();

if (!VertexBuffer) {
    console.log("Failed to create buffer");
    return -1;
  }

  //bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
  //send data
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  //vertex shader config
  var vPosition = gl.getAttribLocation(gl.program, "a_position");

  //vertex attrib pointer
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(vPosition);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.LINE_LOOP, 0, 4);
  gl.drawArrays(gl.LINE_LOOP, 4, 3);
}

main();