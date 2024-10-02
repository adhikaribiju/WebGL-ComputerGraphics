function drawlab1(){
    var c = document.getElementById("canvasdemo");
    var ctx = c.getContext("2d");
    
    // for the semi circle on top
    ctx.beginPath();
    ctx.arc(450, 300, 150, 0, Math.PI, counterclockwise = true);
    ctx.stroke();

    // for the big box
    ctx.moveTo(300,300);
    ctx.lineTo(300,450);
    ctx.moveTo(300,300);
    ctx.lineTo(600,300);
    ctx.moveTo(600,300);
    ctx.lineTo(600,450);
    ctx.moveTo(300,450);
    ctx.lineTo(600,450);

    // for the inner box
    ctx.moveTo(400,350);
    ctx.lineTo(400,450);
    ctx.moveTo(500,350);
    ctx.lineTo(500,450);
    ctx.moveTo(400,350);
    ctx.lineTo(500,350);


    ctx.stroke();

}

drawlab1();