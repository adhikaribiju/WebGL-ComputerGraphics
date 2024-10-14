var numVertices = 4;
var numsides = 6;

var vertices = [];
var corners = [
    [-0.5, 0.5, 0.5], // 0
    [0.5, 0.5, 0.5], // 1
    [0.5, -0.5, 0.5], // 2
    [-0.5, -0.5, 0.5], // 3
    [-0.5, 0.5, -0.5], // 4
    [0.5, 0.5, -0.5], // 5
    [0.5, -0.5, -0.5], // 6
    [-0.5, -0.5, -0.5] // 7
];


var VSHADER_SOURCE = `  
    attribute vec3 coordinates;
    void main() {
        gl_Position = vec4(coordinates, 1.0);
    }
`;

var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

function createsie(a, b,c,d){ // create sides using corners
    var index =[a,b,c,d];
    for(var i = 0; i<numVertexl; i++){
        vertices.push(corners[index[i]]);
    }

}

function initvertices(){
    createside(0,1,2,3); // create side A
    createside(4,5,6,7); // create side B
    createside(4,5,1,0); // create side C  
    createside(7,6,2,3); // create side D
    createside(5,1,2,6); // create side E //createside(5,6,2,1); // create side E
    createside(4,0,3,7); // create side F 
}

function createside(a,b,c,d){
    var index = [a,b,c,d];
    for(var i = 0; i<numVertices; i++){
        vertices.push(corners[index[i]*3, corners[index[i]*3+1], corners[index[i]*3+2]]);
    }
}

function render(){
    gl.drawArrays(gl.LINE_LOOP, 0,4);
    gl.drawArrays(gl.LINE_LOOP, 12,4);
    gl.drawArrays(gl.LINE_LOOP, 24,4);
    gl.drawArrays(gl.LINE_LOOP, 36,4);
    gl.drawArrays(gl.LINE_LOOP, 48,4);
    gl.drawArrays(gl.LINE_LOOP, 60,4);

}

function main(){
    const canvas = document.getElementById('glcanvas');
    gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log("Failed to initialize shaders.");
        return;
    }

    initvertices();

    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("Failed to create buffer object.");
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var coordinates = gl.getAttribLocation(gl.program, 'coordinates');
    gl.vertexAttribPointer(coordinates, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinates);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    render();
}

main();