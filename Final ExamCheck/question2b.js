

var totalPointsAvailable = 3; // the total number of points that the user can click on
var clickCounter = 0; // to keep track of the number of clicks
var radius = 0.0;   // the radius of the circle
var pointVertices = []; // records the points that the user clicks on
var center = []; // the center of the circle || first vertex of the triangle
var circleCoordinates = []; //stores the circle coordinates
var vertex1 = []; // to store the second vertex of the triangle
var vertex2 = []; // to store third vertex of the triangle


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
   // const data = new Float32Array(pointVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointVertices), gl.STATIC_DRAW);
    const colorLoc = gl.getUniformLocation(program, 'color');
    gl.uniform4f(colorLoc,0.0, 1.0, 1.0, 1.0);
    gl.drawArrays(gl.POINTS, 0, pointVertices.length / 3);

  }
  

function displayTriangle() {
    const data = new Float32Array([...center, ...vertex1, ...vertex2]);

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); 

    const colorLoc = gl.getUniformLocation(program, 'color');

    gl.uniform4f(colorLoc, 1.0, 1.0, 1.0, 1.0); // Set color to white
    gl.drawArrays(gl.LINE_LOOP, 0, 3); // draw the borders
}

  
function displayCircle() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT); 

    const color_loc = gl.getUniformLocation(program, 'color');
    gl.uniform4f(color_loc, 0.5, 0.5, 0.5, 1.0); // Set color to grey

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleCoordinates), gl.STATIC_DRAW);

    gl.drawArrays(gl.LINE_LOOP, 0, circleCoordinates.length / 3); //  draw the borders
    displayTriangle();
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
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    return;
}





function createCircleVert(){
    var angle = 0.0;
    var a, b, c; 
    while(angle <= 360){
        var radian = angle * Math.PI/180;
        a = center[0]+radius * Math.cos(radian);
        b = center[1]+radius*Math.sin(radian);
        c= 0.0;
        circleCoordinates.push(a, b, c);
        angle+=0.1;
    }

    //push the center of the circle to the pointVertices
    pointVertices.push(a, b , c)
    displayPoint();

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleCoordinates), gl.STATIC_DRAW);

}

function  onClickHandle(event, canvas){
    var a = event.clientX;
    var b = event.clientY;
    var boundingBox = event.target.getBoundingClientRect();
    if (clickCounter < totalPointsAvailable){
        a = ((a - boundingBox.left) - canvas.width/2)/(canvas.width/2);
        b = (canvas.height/2 - (b-boundingBox.top))/(canvas.height/2);
        c = 0.0;
        // forst click
        if (clickCounter == 0){
            center.push(a, b, c);
            pointVertices.push(a, b, c);
            displayPoint();
        }
        // secnd click
        else if (clickCounter == 1){
            vertex1.push(a, b, c);
            pointVertices.push(a, b, c);
            displayPoint();
            radius = Math.sqrt(Math.pow(center[0]-vertex1[0], 2) + Math.pow(center[1]-vertex1[1], 2));
            createCircleVert();

        }
        // third click; check if the triangle is isoceles
        else if (clickCounter == 2){
            vertex2.push(a, b, c);
            
            var distance = Math.sqrt(Math.pow(center[0]-a, 2) + Math.pow(center[1]-b, 2));
  
            if (Math.abs(distance -radius) < 0.01){
                //then render the circle
                displayCircle();
            }
            else{
                 alert("Trianlge not isoceles, circle can't render."); 
            }
        }  
        clickCounter++;
    }  
}




