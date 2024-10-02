var canvas;
var gl;
var theta = 0.5;
var thetaLoc;

var direction = true;
var speedval = 0.01;
var slider;

var currentColor = [1.0, 0.0, 0.0, 1.0]; // Default color

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
    precision mediump float;
    uniform vec4 u_FragColor; // Unifrom for fragment Color

  void main(){
    gl_FragColor = u_FragColor; // use the uniform color
  }
`;

// Function to update the oclor based on the angel
function updateColor(colorChoice) {
    switch (colorChoice) {
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



// render function
function render() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

 // Update the rotation
  //theta += 0.01;
  
  theta += (direction?speedval:-1*speedval);
  
  gl.uniform1f(thetaLoc, theta);

  // Calculate rotation angle in degrees
  var angleDegrees = theta * (180.0 / Math.PI);

  // Send the updated color to the fragment shader
  gl.uniform4fv(colorLoc, currentColor);

  // Draw the Shape
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


   // Get the location of the 'theta' uniform variable
   thetaLoc = gl.getUniformLocation(gl.program, "theta");

   if (thetaLoc < 0) {
     console.log('Failed to get the storage location of theta');
     return;
   }
 
 // Get the storage location of the uniform variable for color
  colorLoc = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!colorLoc) {
    console.log("Failed to get the storage location of u_FragColor.");
    return;
  }

    document.getElementById("color").onchange=function(event){
        const selectedValue = parseInt(event.target.value, 10);
        updateColor(selectedValue);
    }
    


  // Start rendering
  render();
}
