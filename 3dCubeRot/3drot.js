var numVertex = 4; //number of vertices each side
var numSides = 6;
var vertices = [];
var normals = [];
var angleX = 0;
var angleY = 0;

// Defining corner coordinates for the cube
var corners = [
-0.5, 0.5, 0.5,   // 0 (front top left)
0.5, 0.5, 0.5,    // 1 (front top right)
0.5, -0.5, 0.5,   // 2 (front bottom right)
-0.5, -0.5, 0.5,  // 3 (front bottom left)

-0.5, 0.5, -0.5,  // 4 (back top left)
0.5, 0.5, -0.5,   // 5 (back top right)
0.5, -0.5, -0.5,  // 6 (back bottom right)
-0.5, -0.5, -0.5  // 7 (back bottom left)
];

// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec3 normal;
varying float brightness;
uniform mat4 u_transform;
uniform vec3 lightDirection;
void main() {
gl_Position = u_transform * a_Position;
vec3 normalizedNormal = normalize(mat3(u_transform) * normal);
vec3 normalizedLight = normalize(lightDirection);
brightness = max(dot(normalizedNormal, normalizedLight), 0.0);
}
`;

// Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
uniform vec4 color;
varying float brightness;
void main() {
gl_FragColor = vec4(color.rgb * brightness, color.a);
}
`;

// Create a side of the cube using the corners
function createSide(a, b, c, d, nx, ny, nz) { //normal x,y,z
var index = [a, b, c, d];
for (var i = 0; i < numVertex; i++) {
vertices.push(corners[index[i] * 3], corners[index[i] * 3 + 1], corners[index[i] * 3 + 2]);
// push nx, ny, nz into normal[]
normals.push(nx, ny, nz);
}
}

// Initialize the vertices for the cube
function initVertices() {
createSide(0, 1, 2, 3, 0, 0, 1); // Front face
createSide(4, 5, 6, 7, 0, 0, -1); // Back face
createSide(0, 1, 5, 4, 0, 1, 0); // Top face
createSide(3, 2, 6, 7, 0, -1, 0); // Bottom face
createSide(1, 2, 6, 5, 1, 0, 0); // Right face
createSide(0, 3, 7, 4, -1, 0, 0); // Left face
}

function createTransformationMatrix() {
var cosX = Math.cos(angleX);
var sinX = Math.sin(angleX);
var cosY = Math.cos(angleY);
var sinY = Math.sin(angleY);

return new Float32Array([
cosY, 0 ,sinY, 0,
sinX * sinY, cosX, -cosY * sinX, 0,
-sinY * cosX, sinX, cosX * cosY, 0,
0, 0, 0, 1
]);
}

function main() {
const canvas = document.getElementById('webgl');
gl = canvas.getContext('webgl');
initVertices();

if (!gl) {
console.error('WebGL not supported');
return;
}

gl.enable(gl.DEPTH_TEST);
// Create and bind the buffer object
const vertexBuffer = gl.createBuffer();
if (!vertexBuffer) {
console.log("Failed to create buffer object.");
return;
}
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
console.log("Failed to initialize shaders.");
return;
}

// Get the storage location of the attribute variable
const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
if (a_Position < 0) {
console.log("Failed to get the storage location of a_Position.");
return;
}

// Assign the buffer object to a_Position variable
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_Position);

// set attribute for normal using normal vector
var normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
var normalPosition = gl.getAttribLocation(gl.program, 'normal');
gl.vertexAttribPointer(normalPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(normalPosition);

// set uniform for light direction
var lightLoc = gl.getUniformLocation(gl.program, 'lightDirection');
gl.uniform3f(lightLoc, 3.0, 3.0, 3.0);

gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.enable(gl.DEPTH_TEST);

var lastX, lastY;
var dragging = false;
//capture x and y when we start click on canvas
canvas.onmousedown = function(event){
lastX = event.clientX
lastY = event.clientY
dragging = true;
};

canvas.onmousemove = function(event){
if(dragging){
var dx = event.clientX - lastX
var dy = event.clientY - lastY

angleX += dy * 0.001; // x axis rotation
angleY += dx * 0.001; // y axis rotation (0.01 is the constant C)
render();
}
};

canvas.onmouseup = function(event){
dragging = false;
};

canvas.onmouseout = function(event){
dragging = false;
};

render();
}

function render() {
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update the angles
    //angleX += 0.01;
    //angleY += 0.01;

    // Create the transformation matrix and pass it to the shader
    var u_transformLoc = gl.getUniformLocation(gl.program, 'u_transform');
    var transformationMatrix = createTransformationMatrix();
    gl.uniformMatrix4fv(u_transformLoc, false, transformationMatrix);

    // Draw each face of the cube using LINE_LOOP
    for (let i = 0; i < numSides; i++) {
    if (i == 0) {
    var colorLoc = gl.getUniformLocation(gl.program, 'color');
    var colorvec = [1.0, 0.0, 0.0, 1.0];
    gl.uniform4fv(colorLoc, colorvec);
    gl.drawArrays(gl.TRIANGLE_FAN, i * numVertex, numVertex);
    }else if (i==1){
    var colorLoc = gl.getUniformLocation(gl.program, 'color');
    var colorvec = [0.0, 1.0, 0.0, 1.0];
    gl.uniform4fv(colorLoc, colorvec);
    gl.drawArrays(gl.TRIANGLE_FAN, i * numVertex, numVertex);
    }else if (i==2){
    var colorLoc = gl.getUniformLocation(gl.program, 'color');
    var colorvec = [0.0, 0.0, 1.0, 1.0];
    gl.uniform4fv(colorLoc, colorvec);
    gl.drawArrays(gl.TRIANGLE_FAN, i * numVertex, numVertex);
    }else if (i==3){
    var colorLoc = gl.getUniformLocation(gl.program, 'color');
    var colorvec = [0.0, 1.0, 1.0, 1.0];
    gl.uniform4fv(colorLoc, colorvec);
    gl.drawArrays(gl.TRIANGLE_FAN, i * numVertex, numVertex);
    }else if (i==4){
    var colorLoc = gl.getUniformLocation(gl.program, 'color');
    var colorvec = [1.0, 0.0, 1.0, 1.0];
    gl.uniform4fv(colorLoc, colorvec);
    gl.drawArrays(gl.TRIANGLE_FAN, i * numVertex, numVertex);
    } else if (i==5){
    var colorLoc = gl.getUniformLocation(gl.program, 'color');
    var colorvec = [1.0, 1.0, 0.0, 1.0];
    gl.uniform4fv(colorLoc, colorvec);
    gl.drawArrays(gl.TRIANGLE_FAN, i * numVertex, numVertex);
    }
    gl.drawArrays(gl.LINE_LOOP, i * numVertex, numVertex);
    }

    //requestAnimationFrame(render);
}