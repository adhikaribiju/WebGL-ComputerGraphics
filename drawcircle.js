function drawcircle(){
    var c = document.getElementById("canvasdemo");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, 2*Math.PI);
    ctx.stroke();
}

drawcircle();