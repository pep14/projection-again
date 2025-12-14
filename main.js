/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = 1200;
const canvasHeight = canvasWidth / 16 * 9;

const centerWidth = canvasWidth / 2;
const centerHeight = canvasHeight / 2

const speed = 2.5;
const rotationspeed = 0.01;
const fov = 500;

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    e: false,
    q: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
}

canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);

const camera = new Camera(0, 0, -1000)
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
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const vertical = {
        x:  Math.sin(camera.ry) * Math.cos(camera.rx),
        y: -Math.sin(camera.rx),
        z:  Math.cos(camera.ry) * Math.cos(camera.rx),
    };

    const horizontal = {
        x:  Math.cos(camera.ry),
        y:  0,
        z: -Math.sin(camera.ry),
    };

    if (keys.w) {
        camera.x += vertical.x * speed;
        camera.y += vertical.y * speed;
        camera.z += vertical.z * speed;
    }

    if (keys.s) {
        camera.x -= vertical.x * speed;
        camera.y -= vertical.y * speed;
        camera.z -= vertical.z * speed;
    }

    if (keys.d) {
        camera.x += horizontal.x * speed;
        camera.z += horizontal.z * speed;
    }

    if (keys.a) {
        camera.x -= horizontal.x * speed;
        camera.z -= horizontal.z * speed;
    }

    if (keys.e) camera.y -= speed;
    if (keys.q) camera.y += speed;

    if (keys.ArrowLeft)  camera.ry -= rotationspeed;
    if (keys.ArrowRight) camera.ry += rotationspeed;
    if (keys.ArrowUp)    camera.rx -= rotationspeed;
    if (keys.ArrowDown)  camera.rx += rotationspeed;

    const clamp = Math.PI / 2 - 0.01
    camera.rx = Math.max(-clamp, Math.min(clamp, camera.rx));

    for (var shape of shapes) {
        const vertices = shape.vertices;
        const faces = shape.faces;

        const projected = [];

        for (var v of vertices) {
            var cv = {
                x: v.x - camera.x,
                y: v.y - camera.y,
                z: v.z - camera.z,
            };

            cv = mvMul(yMat(-camera.ry), cv);
            cv = mvMul(xMat(-camera.rx), cv);

            var p = projectFromPerspective(cv, camera.fov)

            if (!p) {
                projected.push(null);
                continue;
            };

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

            if (!v0 || !v1 || !v2) continue;

            drawEdge(v0, v1);
            drawEdge(v1, v2);
            drawEdge(v2, v0);
        }
    }

    requestAnimationFrame(loop)
}

loop();
