const vertices = [
    -0.1, 0.1,   
     0.1, 0.1,   
     0.1, -0.1,   
    -0.1,  -0.1
];

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 vPosition;
    uniform vec2 u_offset;

    void main() {
        gl_Position = vPosition + vec4(u_offset, 0.0, 0.0);
    }
`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Use the uniform color for rendering
    }

    // Function to update the color based on the angle.
    function click(ev, gl, canvas){
        var x = ev.clientX;
        var y = ev.clientY;
        var rect = ev.target.getBoundingClientRect();
        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

        shapes.push({x, y});
        gl.drawArrays(gl.LINE_LOOP, 0, 4);
        gl.clear(gl.COLOR_BUFFER_BIT);
        }

        gl.uniform4f(u_FragColor, x, y, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
`;

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
        console.log("Failed to get the storage location of theta.");
        return;
    }
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log("Failed to get the storage location of u_FragColor.");
        return;
    }

    // Set initial colors and start rendering
    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Set clear color to white
    gl.clear(gl.COLOR_BUFFER_BIT);      // Clear the canvas


    // Initial render
    render();

    };


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


