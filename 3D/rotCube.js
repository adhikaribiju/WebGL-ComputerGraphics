var numVertex = 4; // number of vertices each side
var numSides = 6; // we have 6 sides
var vertices = [];
var angleX = 0;
var angleY = 0;

var corners = [
    [-0.5, 0.5, 0.5], // 0 (front top left)
    [0.5, 0.5, 0.5], // 1 (front top right)
    [0.5, -0.5, 0.5], // 2 (front bottom right)
    [-0.5, -0.5, 0.5], // 3 (front bottom left)
    [-0.5, 0.5, -0.5], // 4 (back top left)
    [0.5, 0.5, -0.5], // 5 (back top right)
    [0.5, -0.5, -0.5], // 6 (back bottom right)
    [-0.5, -0.5, -0.5], // 7 (back bottom left)
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
    var index = [a, b, c, d];
    for (var i = 0; i < numVertex; i++) {
        vertices.push(...corners[index[i]]);
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

    for (let i = 0; i < numSides; i++) {
        if (i == 0) {
            gl.drawArrays(gl.TRIANGLE_FAN, i * numVertex, numVertex);
        }
        gl.drawArrays(gl.LINE_LOOP, i * numVertex, numVertex);
    }
}



function animate() {
    angleX += 0.01;
    angleY += 0.01;

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
        console.log("WebGL not supported, falling back on experimental-webgl");
        gl = canvas.getContext("experimental-webgl");
    }
    if (!gl) {
        console.log("Your browser does not support WebGL");
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

    var colorLoc = gl.getUniformLocation(gl.program, "color");
    var colorvec = [1.0, 0.0, 0.0, 1.0];
    gl.uniform4fv(colorLoc, colorvec);

    animate();
}
