var numVertex = 4;
var numSides = 6;
var vertices = [];
var indices = [];
var angleX = 0;
var angleY = 0;

var radius = 1.0;
var stacks = 30;
var slices = 30;

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_StackIndex;
    attribute float a_SliceIndex;
    varying float v_StackIndex;
    varying float v_SliceIndex;
    uniform mat4 u_transform;

    void main() {
        gl_Position = u_transform * a_Position;
        v_StackIndex = a_StackIndex;
        v_SliceIndex = a_SliceIndex;
    }
`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying float v_StackIndex;
    varying float v_SliceIndex;

    void main() {
        if (mod(floor(v_StackIndex) + floor(v_SliceIndex), 2.0) < 1.0) { 
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // white
        } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black
        }
    }
`;

// Load vertices and indices, including stack index
function loadVerticesAndIndices() {
    for (var i = 0; i <= stacks; i++) {
        var phi = i * Math.PI / stacks;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        for (var j = 0; j <= slices; j++) {
            var theta = j * 2 * Math.PI / slices;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var x = sinPhi * cosTheta;
            var y = sinPhi * sinTheta;
            var z = cosPhi;

            vertices.push(radius * x, radius * y, radius * z, i, j); // Stack index as 4th value
        }
    }

    for (var i = 0; i < stacks; i++) {
        for (var j = 0; j < slices; j++) {
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

    // Create and bind the vertex buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    // Set up position attribute
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(a_Position);

    // Set up stack index attribute
    const a_StackIndex = gl.getAttribLocation(gl.program, "a_StackIndex");
    gl.vertexAttribPointer(a_StackIndex, 1, gl.FLOAT, false, 20, 12);
    gl.enableVertexAttribArray(a_StackIndex);

    // Set up slice index attribute
    const a_SliceIndex = gl.getAttribLocation(gl.program, "a_SliceIndex");
    gl.vertexAttribPointer(a_SliceIndex, 1, gl.FLOAT, false, 20, 16);
    gl.enableVertexAttribArray(a_SliceIndex);

    // Create and bind index buffer
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Clear canvas and enable depth testing
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    angleX += 0.007;
    angleY += 0.007;

    // Create transformation matrix and pass to shader
    var u_transformLoc = gl.getUniformLocation(gl.program, "u_transform");
    var transformationMatrix = createTransformationMatrix();
    gl.uniformMatrix4fv(u_transformLoc, false, transformationMatrix);

    // Draw elements with red and black stripes
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
}

