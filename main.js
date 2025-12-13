/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = 1200;
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

const vertices = [];
const faces = [];

const c = new Vertex(centerWidth, centerHeight, 0);

const r = 300;
const dv = 30;
const dh = dv + 1;

for (var i = 0; i <= dv; i++) {
    const a = i * Math.PI / dv;

    for (var j = 0; j <= dv; j++) {
        const b = 2 * j * Math.PI / dv;

        
        const x = r * Math.sin(a) * Math.cos(b);
        const y = r * Math.sin(a) * Math.sin(b);
        const z = r * Math.cos(a);

        vertices.push(new Vertex(x, y, z));
    }
}

for (var i = 0; i < dv; i++) {
    for (var j = 0; j < dv; j++) {
        const a = i * dh + j;
        const b = a + 1;
        const c = a + dh;
        const d = c + 1;

        faces.push([a, b, c]);
    }
}

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

    const projected = [];

    for (var v of vertices) {
        let rotated = mvMul(xMat(angle), v);
        rotated = mvMul(yMat(angle), rotated);

        projected.push(new Vertex(
            rotated.x + centerWidth,
            rotated.y + centerHeight,
            rotated.z
        ));
    }

    for (var face of faces) {
        const v1 = projected[face[0]];
        const v2 = projected[face[1]];
        const v3 = projected[face[2]];

        drawEdge(v1, v2);
        drawEdge(v2, v3);
        drawEdge(v1, v3);
    }

    requestAnimationFrame(loop)
}

loop();
