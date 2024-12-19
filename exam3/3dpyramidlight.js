var canvas = null;
var program = 0;
var vb ;
var count = 0;
var gl = null;
var canvas = null;
var program = 0;
var vb ;
var count = 0;
var gl = null;

var numvertex = 4; //number of vertices for each side
var numsides = 10; //number of sides 
// add extra one vertex to the top
var vertices = [];
var angle = 0.0;
var axis = 0;
var speed = 0.1;


var corners = [
    [-0.5, 0.25, 0.5], //0
    [0.5, 0.25, 0.5], //1
    [0.5, -0.25, 0.5], //2
    [-0.5, -0.25, 0.5], //3
    [-0.5, 0.25, -0.5], //4
    [0.5, 0.25, -0.5], //5
    [0.5, -0.25, -0.5], //6
    [-0.5, -0.25, -0.5], //7
    [0.0, 1.0, -0.25] //8
];

//=================Shaders======================

var VSHADER_SOURCE = `
    precision highp float;
    attribute vec3 coordinates;
    uniform float angle;

    attribute vec3 normal;
    uniform vec3 light;
    varying float brightness;

    // rotation matrix around x axis
    mat3 rotationX(float theta){
        float c = cos(theta);
        float s = sin(theta);

        return mat3(
            vec3(1,0, 0),
            vec3(0,c, -s),
            vec3(0, s, c)
        );
    }

    // rotation matrix around y axis
    mat3 rotationY(float theta){
        float c = cos(theta);
        float s = sin(theta);

        return mat3(
            vec3(c,0, s),
            vec3(0,1, 0),
            vec3(-s, 0, c)
        );
    }

    // rotation matrix around z axis
    mat3 rotationZ(float theta){
        float c = cos(theta);
        float s = sin(theta);

        return mat3(
            vec3(c,-s, 0),
            vec3(s,c, 0),
            vec3(0, 0, 1)
        );
    }

    void main(){
        mat3 rx = rotationX(100.0 * 3.14 / 180.0);
        mat3 ry = rotationY(100.0 * 3.14 / 180.0);
        mat3 rz = rotationZ(10.0 * 3.14 / 180.0);  
        mat3 rangle = rotationY(angle * 3.14 / 180.0) * rotationX(angle * 3.14 / 180.0);

        vec3 transformedCoordinates = rangle * ry * rz * coordinates;
        gl_Position = vec4(transformedCoordinates, 1.0);

        // Calculate the brightness (dot product of the light direction and the transformed normal)
        brightness = max(dot(light, normalize(ry * rz * normal)), 0.0);
    }
`;

var FSHADER_SOURCE = ` 
precision highp float; 
uniform vec4 color; 
varying float brightness;

void main(){ 
// gl_FragColor = vec4(0.0, 1.0, 1.0, 0.6); 
gl_FragColor = brightness*color*0.6; 
} 
`; 


function createCubeSide(a, b, c, d) { 
    var index = [a, b, c, d];
    for (var i = 0; i < numvertex; i++) {
        vertices.push(...corners[index[i]]);
    }
}
function createPrismSide(a, b, c) {
    var index = [a, b, c];
    for (var i = 0; i < 3; i++) {
        vertices.push(...corners[index[i]]);
    }
    vertices.push(...corners[a]); // Add the first vertex again to complete the triangle
}


function initvertices(){
    createPrismSide(1, 5 , 8);
    createPrismSide(1, 0, 8);
    createPrismSide(0, 4, 8);
    createPrismSide(4, 5, 8);
    createCubeSide(0, 4, 5, 1);

}
function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    const angle_loc = gl.getUniformLocation(program, "angle");
    const color_loc = gl.getUniformLocation(program, 'color');
    const light_loc = gl.getUniformLocation(program, 'light');
    angle += speed;
    if (angle > 360) {
        angle -= 360;
    }
    gl.uniform1f(angle_loc, angle);
    gl.uniform4f(color_loc, 0.0, 0.0, 0.0, 1.0);
    gl.uniform3f(light_loc, 1.0, 1.0, -1.0);

    for (var i = 0; i < vertices.length; i += numvertex) {
        gl.drawArrays(gl.TRIANGLE_FAN, i, numvertex);
    }

    requestAnimationFrame(render);
}


function main() {
    var canvas = document.getElementById("exam3");
    gl = getWebGLContext(canvas);

    initvertices();

    program = ramapoShaderBufferBinder(gl, vertices,  VSHADER_SOURCE, FSHADER_SOURCE);
    gl.useProgram(program);
   
    // clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    render();
    return;
}