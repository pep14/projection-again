class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Camera {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.fov = fov;

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