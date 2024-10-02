// yo chai mama lai sodeko

var canvas;
var gl;
var theta = 0.5;
var thetaLoc;

var vertices = [
  0.0, 1.0, 0.0,
  -1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  0.0, -1.0, 0.0
];

var VSHADER_SOURCE = `
  attribute vec3 vPosition;
  uniform float theta;

  void main(){
    float s = sin(theta);
    float c = cos(theta);

    gl_Position.x = -s * vPosition.y + c * vPosition.x;
    gl_Position.y = s * vPosition.x + c * vPosition.y;
    gl_Position.z = 0.0;
    gl_Position.w = 1.0;
    gl_PointSize = 2.0;
  }
`;

var FSHADER_SOURCE = `
  void main(){
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

function render() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  theta += 0.01;
  gl.uniform1f(thetaLoc, theta);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}

function main() {
  // Assign to global variables, not local ones
  canvas = document.getElementById("glcanvas");
  gl = getWebGLContext(canvas);

  if (gl === null) {
    alert("Unable to support WebGL on your machine.");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    alert("Error: initShader");
    return;
  }

  // Get the location of the 'theta' uniform variable
  thetaLoc = gl.getUniformLocation(gl.program, "theta");

  if (thetaLoc < 0) {
    console.log('Failed to get the storage location of theta');
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

  // Send data
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Assign buffer to shaders - vPosition
  var vPosition = gl.getAttribLocation(gl.program, "vPosition");

  // Vertex attrib pointer
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

  // Enable
  gl.enableVertexAttribArray(vPosition);

  // Start rendering
  render();
}
