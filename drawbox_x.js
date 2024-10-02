function drawbox_x(){
    var c = document.getElementById("canvasdemo");
    var ctx = c.getContext("2d");
    ctx.moveTo(300,0);
    ctx.lineTo(0,300);
    ctx.moveTo(0,0);
    ctx.lineTo(300,300);
    ctx.stroke();
}

drawbox_x();