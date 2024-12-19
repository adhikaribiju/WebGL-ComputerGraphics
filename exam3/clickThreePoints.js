var canvas = null;
var program = 0;
var vb ;
var vertCount = 3;
var gl = null;
var count = 0;
var center = [];//first vertex of the triangle and also the possible center of the circle
var radius = 0.0;
var circum1 = [];//second vertex of the triangle
var circum2 = [];//third vertex of the triangle
var pointVertices = [];//stores the clicked points
var circleVertices = [];//stores the circle coordinates

//=================Shaders======================

var VSHADER_SOURCE = `
    attribute vec3 a_Position;
    void main(){
        gl_Position = vec4(a_Position, 1.0);
        gl_PointSize = 5.0;
    }
`;

var FSHADER_SOURCE = `
    precision highp float; 
    uniform vec4 color; 
    void main(){ 
    gl_FragColor = color; 
} 
`;




function showClickedPoint() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    const data = new Float32Array(pointVertices);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const colorLoc = gl.getUniformLocation(program, 'color');
    gl.uniform4f(colorLoc, 0.0, 1.0, 0.0, 1.0);
    gl.drawArrays(gl.POINTS, 0, pointVertices.length / 3);
  }
  


function main() {
    var canvas = document.getElementById("exam3");
    gl = getWebGLContext(canvas);
    program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.useProgram(program);
    vb = ramapoBufferObject(gl, circleVertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    var a_Position = gl.getAttribLocation(program, 'a_Position');   
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    canvas.onmousedown = function(ev){      
        click(ev, gl, canvas);
    }   
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);//make it black
    return;
}







function  click(ev, gl, canvas){
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if (count < vertCount){
        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y-rect.top))/(canvas.height/2);
        z = 0.0;
        if (count == 0){
            pointVertices.push(x, y, z);
            showClickedPoint();
        }
        
        else if (count == 1){
            pointVertices.push(x, y, z);
            showClickedPoint();
            

        }
        else if (count == 2){
            pointVertices.push(x, y, z);
            showClickedPoint();
            
        }  
        count++;
    }
  
    
}




