let radius = 0.7; // radius of the sphere
let stacks = 30;
let slices = 30;
let vertices = [];
let indices = [];
let colors = [];
let angleX = 0;
let angleY = 0;

// Cube variables
var numVertex = 4; // number of vertices per side
var numSides = 6;  // we have 6 sides
var cube_vertices = [];

// Cube corners 
const corners = [
  [-0.7,  0.7,  0.7],  // 0 (front top left)
  [ 0.7,  0.7,  0.7],  // 1 (front top right)
  [ 0.7, -0.7,  0.7],  // 2 (front bottom right)
  [-0.7, -0.7,  0.7],  // 3 (front bottom left)
  [-0.7,  0.7, -0.7],  // 4 (back top left)
  [ 0.7,  0.7, -0.7],  // 5 (back top right)
  [ 0.7, -0.7, -0.7],  // 6 (back bottom right)
  [-0.7, -0.7, -0.7],  // 7 (back bottom left)
];

// Vertex Shader
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec3 a_Color;
    varying vec3 v_Color;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;

    void main() {
        gl_Position =  u_ViewMatrix * u_ModelMatrix * a_Position;
        v_Color = a_Color;
    }
`;

// Fragment Shader
const FSHADER_SOURCE = `
    precision mediump float;
    varying vec3 v_Color;

    void main() {
        gl_FragColor = vec4(v_Color, 1.0);
    }
`;

// Generate sphere vertices, colors, and indices
function generateSphere() {
    for (let stack = 0; stack <= stacks; stack++) {
        const phi = (Math.PI / stacks) * stack;
        for (let slice = 0; slice <= slices; slice++) {
            const theta = (2 * Math.PI / slices) * slice;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);

            vertices.push(x, y, z);

            // Alternate colors to draw vertical lines
            if (slice % 5 === 0) {
                colors.push(1.0, 1.0, 1.0); // White lines
            } else {
                colors.push(0.8, 0.5, 0.2); // Default sphere color
            }
        }
    }

    for (let stack = 0; stack < stacks; stack++) {
        for (let slice = 0; slice < slices; slice++) {
            const first = stack * (slices + 1) + slice;
            const second = first + slices + 1;
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }
}

// Generate cube vertices from your original code
function createSide(a, b, c, d) {
    // Create side using corners
    var index = [a, b, c, d];
    for (var i = 0; i < numVertex; i++) {
        cube_vertices.push(...corners[index[i]]);
    }
}

function initCubeVertices() {
    createSide(0, 1, 2, 3); // Front face
    createSide(4, 5, 6, 7); // Back face
    createSide(4, 5, 1, 0); // Top face
    createSide(7, 6, 2, 3); // Bottom face
    createSide(5, 6, 2, 1); // Right face
    createSide(4, 7, 3, 0); // Left face
}

// Cube transformation matrix with scaling
function createCubeTransformationMatrix() {
    var angleX = Math.PI / 10;
    var angleY = Math.PI / 16;

    var cosX = Math.cos(angleX);
    var sinX = Math.sin(angleX);
    var cosY = Math.cos(angleY);
    var sinY = Math.sin(angleY);

    // Create rotation matrix
    var rotationMatrix = new Float32Array([
        cosY, 0, sinY, 0,
        sinX * sinY, cosX, -sinX * cosY, 0,
        -cosX * sinY, sinX, cosX * cosY, 0,
        0, 0, 0, 1
    ]);


    return rotationMatrix;
    
}

// Shader initialization
function initShaders(gl, vShaderSource, fShaderSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Vertex Shader Error: " + gl.getShaderInfoLog(vertexShader));
        return null;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Fragment Shader Error: " + gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program Linking Error: " + gl.getProgramInfoLog(program));
        return null;
    }

    return program;
}

// Matrix Multiplication
function multiplyMatrices(a, b) {
    const result = new Float32Array(16);
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            result[row * 4 + col] =
                a[row * 4 + 0] * b[0 * 4 + col] +
                a[row * 4 + 1] * b[1 * 4 + col] +
                a[row * 4 + 2] * b[2 * 4 + col] +
                a[row * 4 + 3] * b[3 * 4 + col];
        }
    }
    return result;
}

// Identity Matrix
function createIdentityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]);
}

// Rotation Matrices
function rotateXMatrix(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Float32Array([
        1, 0, 0, 0,
        0, cos, -sin, 0,
        0, sin, cos, 0,
        0, 0, 0, 1,
    ]);
}

function rotateYMatrix(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Float32Array([
        cos, 0, sin, 0,
        0, 1, 0, 0,
        -sin, 0, cos, 0,
        0, 0, 0, 1,
    ]);
}

// Main Function
function main() {
    const canvas = document.getElementById("webgl");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("Failed to get WebGL context.");
        return;
    }

    generateSphere();
    initCubeVertices();

    const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if (!program) {
        return;
    }
    gl.useProgram(program);

    // Sphere Buffers and Attributes
    const vertexBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    // Cube Buffers and Attributes
    const cubeVertexBuffer = gl.createBuffer();
    const cubeColorBuffer = gl.createBuffer();

    // Sphere buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const a_Color = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Cube buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_vertices), gl.STATIC_DRAW);

    // Cube colors
    const cubeColors = [];
    for (let i = 0; i < cube_vertices.length / 3; i++) {
        cubeColors.push(1.0, 0.0, 0.0); // Red color for cube
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeColors), gl.STATIC_DRAW);

    // Uniform locations
    const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
    const u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
    const u_ProjectionMatrix = gl.getUniformLocation(program, "u_ProjectionMatrix");

    // Matrices
    const modelMatrix = createIdentityMatrix();
    const cubeModelMatrix = createCubeTransformationMatrix(); // Static cube transformation
    const viewMatrix = createIdentityMatrix();
    const projectionMatrix = createIdentityMatrix();

    

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix);

    // Dragging logic
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    canvas.onmousedown = (e) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    };

    canvas.onmouseup = () => {
        dragging = false;
    };

    canvas.onmousemove = (e) => {
        if (dragging) {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            angleX += dy * 0.01;
            angleY += dx * 0.01;
            lastX = e.clientX;
            lastY = e.clientY;
        }
    };

    // Render loop
    function render() {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Render cube (static)
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);

        gl.uniformMatrix4fv(u_ModelMatrix, false, cubeModelMatrix);

        // Draw cube sides as lines for wireframe effect
        for (let i = 0; i < numSides; i++) {
            gl.drawArrays(gl.LINE_LOOP, i * numVertex, numVertex);
        }

        // Update sphere's model matrix based on user interaction
        const rotationX = rotateXMatrix(angleX);
        const rotationY = rotateYMatrix(angleY);
        const combinedMatrix = multiplyMatrices(rotationY, rotationX);

        for (let i = 0; i < 16; i++) {
            modelMatrix[i] = combinedMatrix[i];
        }

        // Render sphere (rotating)
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(render);
    }

    gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background 
    gl.enable(gl.DEPTH_TEST);
    render();
}

main();
