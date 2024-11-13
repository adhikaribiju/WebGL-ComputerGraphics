var numVertex = 4;
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
    uniform vec3 lightDirection1;
    uniform vec3 lightDirection2;

    void main() {

        gl_Position = u_transform * a_Position;
        vec3 normalizedNormal = normalize(mat3(u_transform) * normal);
        // Calculate diffuse brightness from two light sources

        float brightness1 = max(dot(normalizedNormal, normalize(lightDirection1)), 0.0);
        float brightness2 = max(dot(normalizedNormal, normalize(lightDirection2)), 0.0);

       

        // Combine brightness from both lights
        brightness = brightness1 + brightness2;
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

function createSide(a, b, c, d, nx, ny, nz) {

    var index = [a, b, c, d];
    for (var i = 0; i < numVertex; i++) {
        vertices.push(corners[index[i] * 3], corners[index[i] * 3 + 1], corners[index[i] * 3 + 2]);
        normals.push(nx, ny, nz);
    }
}


// Initialize the vertices and normals for the cube

function initVertices() {

    createSide(0, 1, 2, 3, 0, 0, 1);    // Front face
    createSide(4, 5, 6, 7, 0, 0, -1);   // Back face
    createSide(0, 1, 5, 4, 0, 1, 0);    // Top face
    createSide(3, 2, 6, 7, 0, -1, 0);   // Bottom face
    createSide(1, 2, 6, 5, 1, 0, 0);    // Right face
    createSide(0, 3, 7, 4, -1, 0, 0);   // Left face
}


// Create transformation matrix for rotation

function createTransformationMatrix() {

    var cosX = Math.cos(angleX);
    var sinX = Math.sin(angleX);
    var cosY = Math.cos(angleY);
    var sinY = Math.sin(angleY);
    return new Float32Array([

        cosY, 0, sinY, 0,
        sinX * sinY, cosX, -cosY * sinX, 0,
        -cosX * sinY, sinX, cosY * cosX, 0,
        0, 0, 0, 1
    ]);

}


function main() {

    const canvas = document.getElementById('webgl');
    const gl = canvas.getContext('webgl');
    initVertices();

    if (!gl) {
        console.error('WebGL not supported');
        return;

    }


    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }


    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);


    // Set up normal buffer
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    const normalPosition = gl.getAttribLocation(gl.program, 'normal');
    gl.vertexAttribPointer(normalPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalPosition);


    // Set two light directions
    const lightDir1Loc = gl.getUniformLocation(gl.program, 'lightDirection1');
    gl.uniform3f(lightDir1Loc, 3.0, 3.0, 3.0); // Light 1 from top-right

    const lightDir2Loc = gl.getUniformLocation(gl.program, 'lightDirection2');
    gl.uniform3f(lightDir2Loc, -3.0, 3.0, 3.0); // Light 2 from top-left


    // Set the color of the cube

    const colorLoc = gl.getUniformLocation(gl.program, 'color');

    const color = [1.0, 0.5, 0.0, 1.0]; // Orange color

    gl.uniform4fv(colorLoc, color);


    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);


    function render() {

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const transformationMatrix = createTransformationMatrix();
        const u_transformLoc = gl.getUniformLocation(gl.program, 'u_transform');
        gl.uniformMatrix4fv(u_transformLoc, false, transformationMatrix);

        // Draw each face of the cube with the specified color
        for (let i = 0; i < numSides; i++) {
            gl.drawArrays(gl.TRIANGLE_FAN, i * numVertex, numVertex);
        }

        // Increment angles for rotation
        angleX += 0.01;
        angleY += 0.01;

        requestAnimationFrame(render);
    }
    render();
}
