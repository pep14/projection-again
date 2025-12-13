/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = 1080;
const canvasHeight = canvasWidth / 16 * 9;
const centerWidth = canvasWidth / 2;
const centerHeight = canvasHeight / 2

var angle = 0;

const projectionMat = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]

const xMat = (angle) => {
    return [
        [1, 0, 0],
        [0,  Math.cos(angle), -Math.sin(angle)],
        [0,  Math.sin(angle),  Math.cos(angle)],
    ]
}

const yMat = (angle) => {
    return [
        [ Math.cos(angle), 0,  Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0,  Math.cos(angle)],
    ]
}

const zMat = (angle) => {
    return [
        [ Math.cos(angle), -Math.sin(angle), 0],
        [ Math.sin(angle),  Math.cos(angle), 0],
        [0, 0, 1]
    ]
}

canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);

class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    draw() {
        drawVertex(this.x, this.y)
    }
}

const cube = [];
const c = new Vertex(centerWidth, centerHeight, 0);

cube[0] = new Vertex(400, 200, -100);
cube[1] = new Vertex(600, 200, -100);
cube[2] = new Vertex(400, 400, -100);
cube[3] = new Vertex(600, 400, -100);
cube[4] = new Vertex(400, 200,  100);
cube[5] = new Vertex(600, 200,  100);
cube[6] = new Vertex(400, 400,  100);
cube[7] = new Vertex(600, 400,  100);

const cubeFaces = [
    [0, 1, 2], [1, 3, 2],
    [5, 4, 7], [4, 6, 7],
    [4, 0, 6], [0, 2, 6],
    [1, 5, 3], [5, 7, 3],
    [4, 5, 0], [5, 1, 0],
    [2, 3, 6], [3, 7, 6]
]

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
    ctx.moveTo(v.x, v.y);
    ctx.strokeStyle = "white";
    ctx.stroke();
}

function mvMul(m, v) {
    return {
        x: m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z,
        y: m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z,
        z: m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z,
    }
}

function loop() {
    angle += 0.02;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (var v of cube) {
        var centralized = new Vertex(v.x - c.x, v.y - c.y, v.z - c.z)
        var rotated = mvMul(xMat(angle), centralized);
        rotated = mvMul(yMat(angle), rotated);
        var decentralized = new Vertex(rotated.x + c.x, rotated.y + c.y, rotated.z + c.z)
        var projection = mvMul(projectionMat, decentralized);
        
        drawVertex(projection.x, projection.y);
    }

    requestAnimationFrame(loop)
}

loop();
