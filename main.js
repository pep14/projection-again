const camera = new Camera(0, 0, -1000)
const sphere = new Sphere({x: 100, y: 100, z: 100}, 200, 20);
const cube = new Cuboid(
    {x: -200, y: -200, z: -200},
    {x: 0, y: 0, z: 0}
)

const shapes = [cube, sphere]

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
    if (keys.ArrowUp)    camera.rx += rotationspeed;
    if (keys.ArrowDown)  camera.rx -= rotationspeed;

    const clamp = Math.PI / 2 - 0.01
    camera.rx = Math.max(-clamp, Math.min(clamp, camera.rx));

    const globalFaces = [];

    for (const shape of shapes) {
        const vertices = shape.vertices;
        const faces = shape.faces;

        const projected = [];

        for (const v of vertices) {
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

            projected.push({
                x: p.x + centerWidth,
                y: p.y + centerHeight,
                z: cv.z
            });
        }

        for (const face of faces) {
            const v0 = projected[face[0]];
            const v1 = projected[face[1]];
            const v2 = projected[face[2]];

            if (!v0 || !v1 || !v2) continue;

            globalFaces.push([v0, v1, v2])
        }
    }

    globalFaces.sort((a, b) => zIndex(b) - zIndex(a));

    for (const face of globalFaces) {
        ctx.fillStyle = "gray";
        ctx.strokeStyle = "white";

        drawFace([face[0], face[1], face[2]]);
        drawEdge( face[0], face[1] );
        drawEdge( face[1], face[2] );
        drawEdge( face[2], face[0] );
    } 

    requestAnimationFrame(loop)
}

loop();
