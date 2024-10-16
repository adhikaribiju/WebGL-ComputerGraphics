var canvas, gl;
var points = [];
var maxVertices = 3;

var VSHADER_SOURCE = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

var FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);  // White color
  }
`;

function main() {
  canvas = document.getElementById("glcanvas");
  gl = canvas.getContext("webgl");

  if (gl === null) {
    alert("Unable to support WebGL on your machine.");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    alert("Error: initShader");
    return;
  }

  // Create vertex buffer
  var vertexBuffer = gl.createBuffer();

  if (!vertexBuffer) {
    console.log("Failed to create buffer");
    return -1;
  }

  // Bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Set the background color to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Black color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set up canvas event listener for clicks
  canvas.addEventListener("click", onClick, false);
}

function onClick(event) {
  if (points.length >= maxVertices * 2) {
    return;  // to ignore clicks after 3 points
  }

  var rect = canvas.getBoundingClientRect();
  var x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
  var y = ((canvas.height - (event.clientY - rect.top)) / canvas.height) * 2 - 1;

  points.push(x, y);

  // after having 3 points, draw the triangle with lines
  if (points.length === maxVertices * 2) {
    drawTriangleLines();
  }
}

function drawTriangleLines() {

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

  var a_position = gl.getAttribLocation(gl.program, "a_position");

  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_position);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.LINE_LOOP, 0, 3);
}
