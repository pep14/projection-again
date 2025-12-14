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

function mvMul(m, v) {
    return {
        x: m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z,
        y: m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z,
        z: m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z,
    }
}

function projectFromPerspective(v, fov, distance) {
    const z = distance + v.z;

    if (z < 0) return;

    const scale = fov / z;

    return {
        x: v.x * scale,
        y: v.y * scale,
        z: v.z * scale
    }
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

class Cuck {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.distance = 1000;
        this.fov = 500;

        this.rx = 0;
        this.ry = 0;
        this.rz = 0;
    }
}

class Cuboid {
    constructor(u, v) {
        this.vertices = [
            new Vertex(u.x, u.y, u.z),
            new Vertex(v.x, u.y, u.z),
            new Vertex(u.x, v.y, u.z),
            new Vertex(v.x, v.y, u.z),
            new Vertex(u.x, u.y, v.z),
            new Vertex(v.x, u.y, v.z),
            new Vertex(u.x, v.y, v.z),
            new Vertex(v.x, v.y, v.z),
        ]

        this.faces = [
            [0, 1, 2], [1, 3, 2],
            [5, 4, 7], [4, 6, 7],
            [4, 0, 6], [0, 2, 6],
            [1, 5, 3], [5, 7, 3],
            [4, 5, 0], [5, 1, 0],
            [2, 3, 6], [3, 7, 6],
        ]
    }
}

class Sphere {
    constructor(sx, sy, sz, r, detail) {
        const vertices = [];
        const faces = [];

        const dv = detail;
        const dh = dv + 1;

        for (var i = 0; i <= dv; i++) {
            const a = i * Math.PI / dv;

            for (var j = 0; j <= dv; j++) {
                const b = 2 * j * Math.PI / dv;
                
                const x = r * Math.sin(a) * Math.cos(b);
                const y = r * Math.sin(a) * Math.sin(b);
                const z = r * Math.cos(a);

                vertices.push(new Vertex(x + sx, y + sy, z + sz));
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

        this.vertices = vertices;
        this.faces = faces;
    }
}

const camera = new Cuck(0, 0, 0)
const sphere = new Sphere(100, 100, 100, 200, 20);
const cube = new Cuboid(
    new Vertex(-100, -100, -100),
    new Vertex(0, 0, 0)
)

const shapes = [cube, sphere]

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

function loop() {
    angle += 0.02;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (var shape of shapes) {
        const vertices = shape.vertices;
        const faces = shape.faces;

        const projected = [];

        for (var v of vertices) {
            var rotated = mvMul(yMat(camera.ry), v);
            rotated = mvMul(xMat(camera.rx), rotated);

            var p = projectFromPerspective(rotated, camera.fov, camera.distance)

            if (!p) continue;

            p.x -= camera.x;
            p.y -= camera.y;
            p.z -= camera.z;

            projected.push(new Vertex(
                p.x + centerWidth,
                p.y + centerHeight,
                p.z
            ));
        }

        for (var face of faces) {
            const v0 = projected[face[0]];
            const v1 = projected[face[1]];
            const v2 = projected[face[2]];

            drawEdge(v0, v1);
            drawEdge(v1, v2);
            drawEdge(v2, v0);
        }
    }

    requestAnimationFrame(loop)
}

loop();
