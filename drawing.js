function drawVertex(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
}

function drawEdge(u, v) {
    ctx.beginPath();
    ctx.moveTo(u.x, u.y);
    ctx.lineTo(v.x, v.y);
    ctx.stroke();
}

function drawFace(vertices) {
    ctx.beginPath();
    for (const v of vertices) ctx.lineTo(v.x, v.y);
    ctx.closePath();
    
    ctx.fill();
}