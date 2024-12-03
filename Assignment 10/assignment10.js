let radius = 1.0;
let stacks = 30;
let slices = 30;
let vertices = [];
let normals = [];
let indices = [];
let colors = [];
let angleX = 0;
let angleY = 0;

// Vertex Shader
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec3 a_Normal;
    attribute vec3 a_Color;
    varying vec3 v_Color;
    varying float v_Lighting;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_NormalMatrix;
    uniform vec3 u_LightDirection;
    uniform vec3 u_AmbientLight;

    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;

        vec3 transformedNormal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 0.0)));
        float nDotL = max(dot(transformedNormal, u_LightDirection), 0.0);

        v_Lighting = nDotL + 0.2; // Ambient + Diffuse
        v_Color = a_Color;
    }
`;

// Fragment Shader
const FSHADER_SOURCE = `
    precision mediump float;
    varying vec3 v_Color;
    varying float v_Lighting;

    void main() {
        gl_FragColor = vec4(v_Color * v_Lighting, 1.0);
    }
`;

// Generate sphere vertices, normals, colors, and indices
function generateSphere() {
    for (let stack = 0; stack <= stacks; stack++) {
        const phi = (Math.PI / stacks) * stack;
        for (let slice = 0; slice <= slices; slice++) {
            const theta = (2 * Math.PI / slices) * slice;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);

            vertices.push(x, y, z);
            normals.push(x / radius, y / radius, z / radius);

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

    const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if (!program) {
        return;
    }
    gl.useProgram(program);

    // Buffers and Uniforms Setup
    const vertexBuffer = gl.createBuffer();
    const normalBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    const a_Normal = gl.getAttribLocation(program, "a_Normal");
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const a_Color = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Uniform locations
    const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
    const u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
    const u_ProjectionMatrix = gl.getUniformLocation(program, "u_ProjectionMatrix");
    const u_NormalMatrix = gl.getUniformLocation(program, "u_NormalMatrix");
    const u_LightDirection = gl.getUniformLocation(program, "u_LightDirection");
    const u_AmbientLight = gl.getUniformLocation(program, "u_AmbientLight");

    // Matrices
    const modelMatrix = createIdentityMatrix();
    const viewMatrix = createIdentityMatrix();
    const projectionMatrix = createIdentityMatrix();
    const normalMatrix = createIdentityMatrix();

    viewMatrix[14] = -5; // Move camera back
    const fov = Math.PI / 4;
    const aspect = canvas.width / canvas.height;
    const near = 0.1;
    const far = 100;
    projectionMatrix[0] = 1 / (aspect * Math.tan(fov / 2));
    projectionMatrix[5] = 1 / Math.tan(fov / 2);
    projectionMatrix[10] = -(far + near) / (far - near);
    projectionMatrix[11] = -1;
    projectionMatrix[14] = (-2 * near * far) / (far - near);

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix);
    gl.uniform3fv(u_LightDirection, new Float32Array([0.5, 1.0, 0.5])); // Light direction
    gl.uniform3fv(u_AmbientLight, new Float32Array([0.1, 0.1, 0.1]));   // Softer ambient light

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

        const rotationX = rotateXMatrix(angleX);
        const rotationY = rotateYMatrix(angleY);

        const combinedMatrix = multiplyMatrices(rotationY, rotationX);

        for (let i = 0; i < 16; i++) {
            modelMatrix[i] = combinedMatrix[i];
        }

        for (let i = 0; i < 16; i++) {
            normalMatrix[i] = modelMatrix[i];
        }

        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(render);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Pitch black background
    gl.enable(gl.DEPTH_TEST);
    render();
}
