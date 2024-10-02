var VSHADER_SOURCE = `
  attribute vec4 a_position;
  uniform float u_Scale;
  void main() {
    gl_Position = a_position * u_Scale;
    gl_PointSize = 1.0; // Make points thinner
  }
`;

var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_color;
  void main () {
    gl_FragColor = u_color;
  }
`;

var scale = 1.0; // Initial scaling factor

function main() {
  const canvas = document.getElementById("glcanvas");
  var gl = getWebGLContext(canvas);

  if (gl === null) {
    alert("Unable to support WebGL on your machine.");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    alert("Error: initShader");
    return;
  }

  // Get the storage location of u_color and u_Scale
  var u_color = gl.getUniformLocation(gl.program, 'u_color');
  if (!u_color) {
    console.log('Failed to get the storage location of u_color');
    return;
  }

  var u_Scale = gl.getUniformLocation(gl.program, 'u_Scale');
  if (!u_Scale) {
    console.log('Failed to get the storage location of u_Scale');
    return;
  }

  var buffers = myinitVertexBuffer(gl);

  drawScene(gl, u_color, u_Scale, buffers);
}

function drawScene(gl, u_color, u_Scale, buffers) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set the scaling factor
  gl.uniform1f(u_Scale, scale);

  // Quadrant 1 (Red)
  gl.uniform4f(u_color, 1.0, 0.0, 0.0, 1.0); 
  drawPoints(gl, buffers.q1);

  // Quadrant 2 (Green)
  gl.uniform4f(u_color, 0.0, 1.0, 0.0, 1.0); 
  drawPoints(gl, buffers.q2);

  // Quadrant 3 (Blue)
  gl.uniform4f(u_color, 0.0, 0.0, 1.0, 1.0); 
  drawPoints(gl, buffers.q3);

  // Quadrant 4 (Yellow)
  gl.uniform4f(u_color, 1.0, 1.0, 0.0, 1.0); 
  drawPoints(gl, buffers.q4);
}

function myinitVertexBuffer(gl) {
  var step = 0.01; // Adjust for point density

  // to store positions for each quadrant
  var positionsQ1 = [];
  var positionsQ2 = [];
  var positionsQ3 = [];
  var positionsQ4 = [];

  // generating points within the diamond
  for (var x = -0.8; x <= 0.8; x += step) {
    for (var y = -0.8; y <= 0.8; y += step) {

      if (Math.abs(x / 0.8) + Math.abs(y / 0.8) <= 1.0) {
        if (x >= 0 && y >= 0) {
          // Quadrant 1
          positionsQ1.push(x, y);
        } else if (x < 0 && y >= 0) {
          // Quadrant 2
          positionsQ2.push(x, y);
        } else if (x < 0 && y < 0) {
          // Quadrant 3
          positionsQ3.push(x, y);
        } else {
          // Quadrant 4
          positionsQ4.push(x, y);
        }
      }
    }
  }

  // Creating buffers for each quadrant
  var buffers = {
    q1: createBuffer(gl, positionsQ1),
    q2: createBuffer(gl, positionsQ2),
    q3: createBuffer(gl, positionsQ3),
    q4: createBuffer(gl, positionsQ4)
  };

  return buffers;
}

function createBuffer(gl, positions) {
  var vertices = new Float32Array(positions);
  var n = positions.length / 2; // Number of points

  // buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create buffer");
    return null;
  }

  // bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  return {
    buffer: vertexBuffer,
    numPoints: n
  };
}

function drawPoints(gl, bufferInfo) {
  // bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.buffer);

  // storage location
  var a_position = gl.getAttribLocation(gl.program, "a_position");
  if (a_position < 0) {
    console.log("Failed to get the storage location of a_position");
    return;
  }

  //vertex attrib pointer
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);


  gl.enableVertexAttribArray(a_position);

  // draw the points
  gl.drawArrays(gl.POINTS, 0, bufferInfo.numPoints);
}
