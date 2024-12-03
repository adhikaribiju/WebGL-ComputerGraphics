var numVertex = 4; // number of cube_vertices each side
var numSides = 6; // we have 6 sides
var cube_vertices = [];

const corners = [
  [-0.5,  0.5,  0.5],  // 0 (front top left)
  [ 0.5,  0.5,  0.5],  // 1 (front top right)
  [ 0.5, -0.5,  0.5],  // 2 (front bottom right)
  [-0.5, -0.5,  0.5],  // 3 (front bottom left)
  [-0.5,  0.5, -0.5],  // 4 (back top left)
  [ 0.5,  0.5, -0.5],  // 5 (back top right)
  [ 0.5, -0.5, -0.5],  // 6 (back bottom right)
  [-0.5, -0.5, -0.5],  // 7 (back bottom left)
];


var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_transform;
  void main(){
    gl_Position = u_transform * a_Position;
  }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 color;
  void main(){
    gl_FragColor = color;
    }
`;

function createSide(a, b, c, d) {
  //create side using corners
  var index = [a, b, c, d];
  for (var i = 0; i < numVertex; i++) {
    cube_vertices.push(...corners[index[i]]);
}
}

function initVertices() {
  createSide(0, 1, 2, 3); // create side A
  createSide(4, 5, 6, 7); // create side B
  createSide(4, 5, 1, 0); // create side C
  createSide(7, 6, 2, 3); // create side D
  createSide(5, 6, 2, 1); // create side E
  createSide(4, 7, 3, 0); // create side F
}

function createTransformationMatrix() {
  var angleX = (Math.PI / 180)*15;
  var angleY = (Math.PI / 180)*15;

  var cosX = Math.cos(angleX);
  var sinX = Math.sin(angleX);
  var cosY = Math.cos(angleY);
  var sinY = Math.sin(angleY);

  return new Float32Array([
    cosY, 0, sinY, 0,
    sinX * sinY, cosX, -sinX * cosY, 0,
    -cosX * sinY, sinX, cosX * cosY, 0,
    0, 0, 0, 1
  ]);
}


function render() {
  // Specify the color for clearing <canvas>
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  
  // Clear <canvas> and the depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
for (let i =0; i< numSides; i++){
    // Draw each side of the cube using correct vertex indices
    gl.drawArrays(gl.LINE_LOOP, i*numVertex, numVertex); 
}

}


function main() {
  // Get canvas element and check if WebGL enabled
  var canvas = document.getElementById("webgl");
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("WebGL not supported, falling back on experimental-webgl");
    gl = canvas.getContext("experimental-webgl");
  }
  if (!gl) {
    console.log("Your browser does not support WebGL");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  // Initialize cube_vertices
  initVertices();

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_vertices), gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // get uniform position
  var colorLoc = gl.getUniformLocation(gl.program, "color");
  var colorvec = [1.0, 0.0, 0.0, 1.0];
  gl.uniform4fv(colorLoc, colorvec );

  //Matrix u_transform
  var transformationMatrix = createTransformationMatrix();
  var u_transformLoc = gl.getUniformLocation(gl.program, "u_transform");
  gl.uniformMatrix4fv(u_transformLoc, false, transformationMatrix);

  // Draw the rectangle
  render();
}
