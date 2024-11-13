var numVertex = 4;
var numSides = 6;
var vertices = [];
var normals = [];
var angleX = 0;
var angleY = 0;

var radius = 1.0;
var stacks = 30;
var slices = 30;
var indices =[]

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_transform;

    void main() {
        gl_Position = u_transform * a_Position;
    }
`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 color;

    void main() {
        gl_FragColor = color;
    }
`;

function loadVerticesAndIndices() {
    for(var i = 0; i <= stacks; i++) {
        var phi = i * Math.PI / stacks;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        for(var j = 0; j <= slices; j++) {
            var theta = j * 2 * Math.PI / slices;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var x = sinPhi * cosTheta;
            var y = sinPhi * sinTheta;
            var z = cosPhi;

            vertices.push(radius * x, radius * y, radius * z);
        }
    }

    for(var i = 0; i < stacks; i++) {
        for(var j = 0; j < slices; j++) {
            var first = i * (slices + 1) + j;
            var second = first + slices + 1;
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        
        }
    }
}


function createTransformationMatrix() {
  var cosX = Math.cos(angleX);
  var sinX = Math.sin(angleX);
  var cosY = Math.cos(angleY);
  var sinY = Math.sin(angleY);

  return new Float32Array([
    cosY, 0, sinY, 0,
    sinX * sinY, cosX, -cosY * sinX, 0,
    -sinY * cosX, sinX, cosX * cosY, 0,
    0, 0, 0, 1
  ]);
}

function main() {
    const canvas = document.getElementById("webgl");
    gl = canvas.getContext("webgl");
    loadVerticesAndIndices();

    if (!gl) {
        console.error("WebGL not supported");
        return;
    }

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
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position.");
        return;
    }

    //Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);


    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log("Failed to create buffer object.");
        return;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    var colorLoc = gl.getUniformLocation(gl.program, "color");
    var colorVec = [0.5, 0.5, 0.0, 1.0];
    gl.uniform4fv(colorLoc, colorVec);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    render(); 
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    angleX += 0.01;
    angleY += 0.01;

    // Create the transformation matrix and pass it to the shader
    var u_transformLoc = gl.getUniformLocation(gl.program, "u_transform");
    var transformationMatrix = createTransformationMatrix();
    gl.uniformMatrix4fv(u_transformLoc, false, transformationMatrix);

    gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
}
 