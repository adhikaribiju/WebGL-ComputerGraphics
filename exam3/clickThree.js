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


function drawTriangle() {
    const data = new Float32Array([...center, ...circum1, ...circum2]);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); 
    const colorLoc = gl.getUniformLocation(program, 'color');
    gl.uniform4f(colorLoc, 0.0, 1.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  
function renderCircle(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);//make it black
    const color_loc = gl.getUniformLocation(program, 'color');
    gl.uniform4f(color_loc, 1.0, 0.0, 1.0, 1.0);
    for (var i = 0; i < circleVertices.length; i++){
        gl.drawArrays(gl.TRIANGLE_FAN, i, circleVertices.length);
    }
    drawTriangle();
}

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





function createCircleVert(){
    var angle = 0.0;
    var x, y, z;//corodinates of circle
    while(angle <= 360){
        var radian = angle * Math.PI/180;
        x = center[0]+radius * Math.cos(radian);
        y = center[1]+radius*Math.sin(radian);
        z= 0.0;
        circleVertices.push(x, y, z);
        angle+=0.1;
    }

    //show the last coordinates of the circle so that if the user clicks on it the circle shows
    pointVertices.push(x, y , z)
    showClickedPoint();
    //priting the circle vertices in the console for my ease
    console.log(circleVertices)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleVertices), gl.STATIC_DRAW);
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
            center.push(x, y, z);
            pointVertices.push(x, y, z);
            showClickedPoint();
        }
        //calculate coordinates for the circle at second click
        //coordinate 1
        else if (count == 1){
            circum1.push(x, y, z);
            pointVertices.push(x, y, z);
            showClickedPoint();
            radius = Math.sqrt(Math.pow(center[0]-circum1[0], 2) + Math.pow(center[1]-circum1[1], 2));
            createCircleVert();

        }
        //at third click check to see if the third click lies on the circumference
        else if (count == 2){
            circum2.push(x, y, z);
            //check if the coordinates that you just clicked on lies in circleVertices
            var distance = Math.sqrt(Math.pow(center[0]-x, 2) + Math.pow(center[1]-y, 2));
            //also draw the triangle
            console.log(Math.abs(distance-radius))
            if (Math.abs(distance -radius) < 0.01){//this has to be zero but for my ease i am putting 0.01
                //then render the circle
                console.log("same ")
                renderCircle();
            }
            //throws an error
            else{
                alert("ERROR: TRIANGLE IS NOT COMPATIBLE FOR CIRCLE")
            }
        }  
        count++;
    }
  
    
}




