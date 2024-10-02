// class ma gareko chalena

const npoints = 10000;

var canvas;
var gl;
var theta = 0.5;
var thetaLoc;

var vertices = [0.0, 1.0, 0.0,
                 -1.0, 0.0, 0.0,
                 1.0, 0.0, 0.0,
                 0.0, -1.0, 0.0];

var VSHADER_SOURCE = `
  attribute vec3 vPositions;
  uniform float theta;

  void main(){
    float s = sin(theta);
    float c = cos (theta);

        gl_Position.x = -s*vPosition.y+c*vPostion.x;
        gl_Position.y = s*vPosition.x+c*vPostion.y;
        gl_Position.z =  0.0;
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
  const canvas = document.getElementById("glcanvas");
  const gl = getWebGLContext(canvas);


  if (gl === null) {
    alert("Unable to support WebGL on your machine.");
    return;
  }

  //initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    alert("Error: initShader");
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

  //assign buffer to shaders - vposition
  var vPosition = gl.getAttribLocation(gl.program, "vPositions"));

  //vertex attrib pointer
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

  //enable
  gl.enableVertexAttribArray(vPosition);

  //drawArrays
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  console.log(vertices.length);
  gl.drawArrays(gl.POINTS, 0, vertices.length);

  render();
}
