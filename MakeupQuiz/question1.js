
var canvas;
var gl;
var theta = 0.5;
var thetaLoc;

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
    gl_PointSize = 10.0;
  }
`;



var FSHADER_SOURCE = `
    void main() {
      gl_FragColor = vec4(1.0,1.0,1.0,1.0); /// white
    }
`;


function render() {
    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += 0.005;
    gl.uniform1f(thetaLoc, theta);
   
    gl.drawArrays(gl.POINTS, 0, 1);
    // Request the next animation frame
    requestAnimationFrame(render);
}

function main() {
    // Get the canvas element
    canvas = document.getElementById('webgl');

    // Initialize WebGL context
    gl = canvas.getContext("webgl");
    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    // Initialize vertex buffer
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create buffer object.");
        return;
    }

      // Get the location of the 'theta' uniform variable
    thetaLoc = gl.getUniformLocation(gl.program, "theta");

    if (thetaLoc < 0) {
        console.log('Failed to get the storage location of theta');
        return;
    }

    var vertices = new Float32Array([0.0, 0.7, 0.0]);

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write the vertex coordinates and enable it
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Get the storage location of vPosition
    var vPosition = gl.getAttribLocation(gl.program, 'vPosition');
    if (vPosition < 0) {
        console.log("Failed to get the storage location of vPosition.");
        return;
    }

    // Assign the buffer object to vPosition variable
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    // Enable the assignment to vPosition
    gl.enableVertexAttribArray(vPosition);

    render();
}

main();