var numVertex = 3; // number of vertices each side (triangles)
var numSides = 4; // we have 4 triangular sides and 1 square base
var vertices = [];
var angleX = Math.PI / 18; // 10 degrees in radians
var angleY = 0;

var corners = [
    [-0.5, -0.5, 0.5],  // 0 (base front left)
    [0.5, -0.5, 0.5],   // 1 (base front right)
    [0.5, -0.5, -0.5],  // 2 (base back right)
    [-0.5, -0.5, -0.5], // 3 (base back left)
    [0.0, 0.5, 0.0]     // 4 (apex)
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

function createSide(a, b, c) {
    var index = [a, b, c];
    for (var i = 0; i < numVertex; i++) {
        vertices.push(...corners[index[i]]);
    }
}

function initVertices() {
    createSide(0, 1, 4); // create side A
    createSide(1, 2, 4); // create side B
    createSide(2, 3, 4); // create side C
    createSide(3, 0, 4); // create side D
    vertices.push(...corners[0], ...corners[1], ...corners[2], ...corners[3]); // create base
}

function createTransformationMatrix(angleX, angleY) {
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
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var colorLoc = gl.getUniformLocation(gl.program, "color");

    var colorvec = [0.0, 0.0, 1.0, 1.0]; // Blue color for borders

    for (let i = 0; i < numSides; i++) {
        gl.uniform4fv(colorLoc, colorvec);
        gl.drawArrays(gl.LINE_LOOP, i * numVertex, numVertex);
    }

    // Draw the base
    gl.uniform4fv(colorLoc, colorvec);
    gl.drawArrays(gl.LINE_LOOP, numSides * numVertex, 4);
}

function animate() {
    angleY += 0.01; // Increment angleY for right to left rotation

    var transformationMatrix = createTransformationMatrix(angleX, angleY);
    var u_transformLoc = gl.getUniformLocation(gl.program, "u_transform");
    gl.uniformMatrix4fv(u_transformLoc, false, transformationMatrix);

    render();
    requestAnimationFrame(animate);
}


function main() {
    var canvas = document.getElementById("webgl");
    gl = getWebGLContext(canvas);

    if (!gl) {
        console.log("WebGL not supported");
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    initVertices();

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    animate();
}
