
var canvas;
var gl;
var theta = 0.5;
var thetaLoc;

var VSHADER_SOURCE = `
  attribute vec3 vPosition;
  uniform float theta;
  attribute float aVertexIndex;

  void main(){
    float direction = aVertexIndex == 0.0 ? 1.0 : -1.0; // Clockwise for index 0, Counterclockwise for index 1
    float s = sin(direction * theta);
    float c = cos(direction * theta);

    gl_Position.x = -s * vPosition.y + c * vPosition.x;
    gl_Position.y = s * vPosition.x + c * vPosition.y;
    gl_Position.z = 0.0;
    gl_Position.w = 1.0;
    gl_PointSize = 10.0;
  }
`;


var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor; // Unifrom for fragment Color

  void main(){
    gl_FragColor = u_FragColor; // use the uniform color
  }
`;


// Function to update the oclor based on the angel
function updateColor(angleDegrees) {
    var segment = Math.floor(angleDegrees / 45) % 3; // Change color every 45 degrees
    switch (segment) {
        case 0:
            currentColor = [1.0, 0.0, 0.0, 1.0]; // Red
            break;
        case 1:
            currentColor = [0.0, 1.0, 0.0, 1.0]; // Green
            break;
        case 2:
            currentColor = [0.0, 0.0, 1.0, 1.0]; // Blue
            break;
    }
}



// Render function
function render() {
    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    theta += 0.005;
    gl.uniform1f(thetaLoc, theta);

    // Calculate rotation angle in degrees
    var angleDegrees = theta * (180.0 / Math.PI);

    // Change color after every 45 degrees of rotation
    updateColor(angleDegrees);

    gl.uniform4fv(colorLoc, currentColor); // Set the color uniform
   
    gl.drawArrays(gl.POINTS, 0, 2);

    // Request the next frame
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


    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    var vertices = new Float32Array([
        0.5, 0.5, 0.0,  
        -0.5, 0.5, 0.0
    ]);

    var vertexIndices = new Float32Array([
        0.0, // Index for the first point (Clockwise)
        1.0  // Index for the second point (Counterclockwise)
    ]);
    

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
    gl.enableVertexAttribArray(vPosition);

    // Get the storage location of the uniform variable theta
    thetaLoc = gl.getUniformLocation(gl.program, "theta");
    if (!thetaLoc) {
        console.log("Failed to get the storage location of theta.");
        return;
    }


    // Get the storage location of the uniform variable for color
    colorLoc = gl.getUniformLocation(gl.program, "u_FragColor");
    if (!colorLoc) {
        console.log("Failed to get the storage location of u_FragColor.");
        return;
    }

    // Bind and set up the vertex index buffer
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW);

    var aVertexIndex = gl.getAttribLocation(gl.program, 'aVertexIndex');
    gl.vertexAttribPointer(aVertexIndex, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexIndex);

    // Set the clear color to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Start rendering
    render();
}
main();