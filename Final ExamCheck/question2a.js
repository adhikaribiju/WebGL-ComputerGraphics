var clickCounter = 0;
var pointVertices = []; //stores the clicked points
var totalPointsAvailable = 3;


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


function displayPoint() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    const data = new Float32Array(pointVertices);

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const colorLoc = gl.getUniformLocation(program, 'color');

    gl.uniform4f(colorLoc, 0.0, 1.0, 1.0, 1.0);

    gl.drawArrays(gl.POINTS, 0, pointVertices.length / 3);

  }
  


function main() {
    var canvas = document.getElementById("webgl");
    gl = getWebGLContext(canvas);

    program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    gl.useProgram(program);
    vertexBuffer = gl.createBuffer();

    if (!vertexBuffer) {
        console.log("Failed to create buffer");
        return -1;
      }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var a_Position = gl.getAttribLocation(program, 'a_Position');   
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    canvas.onmousedown = function(event){      
        onClickHandle(event, canvas);
    }   
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT); //make it black
    return;
}




function  onClickHandle(event, canvas){
    var a = event.clientX;
    var b = event.clientY;
    var rect = event.target.getBoundingClientRect();
    if (clickCounter < totalPointsAvailable){
        a = ((a - rect.left) - canvas.width/2)/(canvas.width/2);
        b = (canvas.height/2 - (b-rect.top))/(canvas.height/2);

        c = 0.0;
        if (clickCounter >= 0 && clickCounter < 3){
            pointVertices.push(a, b, c);
            displayPoint();
        }
        
        // else if (clickCounter == 1){
        //     pointVertices.push(a, b, c);
        //     displayPoint();
        // }
        // else if (clickCounter == 2){
        //     pointVertices.push(a, b, c);
        //     displayPoint();
        // }  

        clickCounter++;
    }
}




