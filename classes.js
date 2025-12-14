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
            {x: u.x, y: u.y, z: u.z},
            {x: v.x, y: u.y, z: u.z},
            {x: u.x, y: v.y, z: u.z},
            {x: v.x, y: v.y, z: u.z},
            {x: u.x, y: u.y, z: v.z},
            {x: v.x, y: u.y, z: v.z},
            {x: u.x, y: v.y, z: v.z},
            {x: v.x, y: v.y, z: v.z},
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
    constructor(c, r, detail) {
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

                vertices.push({x: x + c.x, y: y + c.y, z: z + c.z});
            }
        }

        for (var i = 0; i < dv; i++) {
            for (var j = 0; j < dv; j++) {
                const a = i * dh + j;
                const b = a + 1;
                const c = a + dh;
                const d = c + 1

                faces.push([a, b, c]);
                faces.push([b, c, d]);
            }
        }

        this.vertices = vertices;
        this.faces = faces;
    }
}