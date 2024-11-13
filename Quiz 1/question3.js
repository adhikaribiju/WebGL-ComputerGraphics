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
    uniform float theta;
    void main() {
        float s = sin(theta);
        float c = cos(theta);
        gl_Position.x = c * aPosition.x - s * aPosition.y;
        gl_Position.y = s * aPosition.x + c * aPosition.y;
        gl_Position.z = 0.0;
        gl_Position.w = 1.0;
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

let gl, u_FragColor, thetaLoc;
let wallColor = [1.0, 0.0, 0.0, 1.0];  // Default wall color (red)
let roofColor = [1.0, 1.0, 0.0, 1.0];  // Default roof color (yellow)
let theta = 0.0;  // Initial rotation angle

function main() {
    const canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create buffer object.");
        return;
    }

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
    thetaLoc = gl.getUniformLocation(gl.program, 'theta');
    if (!u_FragColor || thetaLoc < 0) {
        console.log("Failed to get the storage location of u_FragColor or theta.");
        return;
    }

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    document.getElementById('wallColor').addEventListener('change', (e) => {
        wallColor = getColorFromSelection(e.target.value);
        render();
    });

    document.getElementById('roofColor').addEventListener('change', (e) => {
        roofColor = getColorFromSelection(e.target.value);
        render();
    });

    // Start rendering
    render();
}

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

    // Update the rotation angle
    theta += 0.01;
    gl.uniform1f(thetaLoc, theta);

    // Draw the square base (walls)
    gl.uniform4fv(u_FragColor, wallColor);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // Draw the triangle roof
    gl.uniform4fv(u_FragColor, roofColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 3);

    requestAnimationFrame(render);
}

main();
