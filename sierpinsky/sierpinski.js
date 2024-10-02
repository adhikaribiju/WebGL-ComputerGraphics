const npoints = 10000;

var vertices = [0.0, 0.8, 0.0, -0.8, 0.0, 0.0, 0.8, 0.0, 0.0];

var VSHADER_SOURCE = `
  attribute vec3 coordinates;
  void main(){
    gl_Position = vec4(coordinates, 1.0);
    gl_PointSize = 2.0;
  }
`;

var FSHADER_SOURCE = `
  void main(){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    
  }
`;

function sierpinsky() {
  var p = [0.0, 0.0, 0.0];
  var idx = [0, 3, 6];
  var id = 0;
  var i = 0;

  for (i = 0; i < npoints; i++) {
    id = idx[Math.floor(Math.random() * 3)];
    p[0] = (p[0] + vertices[id]) / 2;
    p[1] = (p[1] + vertices[id + 1]) / 2;
    p[2] = 0;
    vertices.push(...p);
  }
}

function main() {
  const canvas = document.getElementById("glcanvas");
  const gl = getWebGLContext(canvas);

  sierpinsky();

  if (gl === null) {
    alert("Unable to support WebGL on your machine.");
    return;
  }

  //create vertex buffer
  var vertexBuffer = gl.createBuffer();

  if (!vertexBuffer) {
    console.log("Failed to create buffer");
    return -1;
  }

  //bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  //send data
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  //initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    alert("Error: initShader");
    return;
  }

  //assign buffer object to shaders
  var coord = (x = gl.getAttribLocation(gl.program, "coordinates"));

  //vertex attrib pointer
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

  //enable
  gl.enableVertexAttribArray(coord);

  //drawArrays
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  console.log(vertices.length);
  gl.drawArrays(gl.POINTS, 0, vertices.length/3);
}
