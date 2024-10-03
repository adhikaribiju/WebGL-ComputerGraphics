const vertices = [
    // Square base
    -0.5, -0.5,   // Bottom-left corner
     0.5, -0.5,   // Bottom-right corner
     0.5,  0.0,   // Top-right corner
    -0.5,  0.0,   // Top-left corner

    // Triangle roof
    -0.5,  0.0,   // Left point of the roof
     0.5,  0.0,   // Right point of the roof
     0.0,  0.5    // Top point of the roof
];

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 aPosition;
    void main() {
        gl_Position = aPosition;
    }
`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`;

let gl, u_FragColor;
let wallColor = [1.0, 0.0, 0.0, 1.0];  // Default wall color (red)
let roofColor = [1.0, 1.0, 0.0, 1.0];  // Default roof color (yellow)

function main() {
    // Get the canvas element and WebGL context
    const canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    // Initialize vertex buffer
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create buffer object.");
        return;
    }

    // Bind the buffer object and write data to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(gl.program, 'aPosition');
    if (aPosition < 0) {
        console.log("Failed to get the storage location of aPosition.");
        return;
    }
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log("Failed to get the storage location of u_FragColor.");
        return;
    }

    // Set initial colors and start rendering
    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Set clear color to white
    gl.clear(gl.COLOR_BUFFER_BIT);      // Clear the canvas

    // Set up color change event listeners
    document.getElementById('wallColor').addEventListener('change', (e) => {
        wallColor = getColorFromSelection(e.target.value);
        render();
    });

    document.getElementById('roofColor').addEventListener('change', (e) => {
        roofColor = getColorFromSelection(e.target.value);
        render();
    });

    // Initial render
    render();

    };

function getColorFromSelection(selection) {
    switch (selection) {
        case 'red': return [1.0, 0.0, 0.0, 1.0];
        case 'green': return [0.0, 1.0, 0.0, 1.0];
        case 'blue': return [0.0, 0.0, 1.0, 1.0];
        case 'yellow': return [1.0, 1.0, 0.0, 1.0];
        default: return [1.0, 0.0, 0.0, 1.0];  // Default to red
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the square base (walls)
    gl.uniform4fv(u_FragColor, wallColor);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);  // Drawing the square with the first 4 vertices

    // Draw the triangle roof
    gl.uniform4fv(u_FragColor, roofColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 3);     // Drawing the triangle with the last 3 vertices
}

main();
