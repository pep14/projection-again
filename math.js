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

function projectFromPerspective(v, fov) {
    if (v.z <= 0.01) return null;

    const scale = fov / v.z;

    return {
        x: v.x * scale,
        y: v.y * scale,
        z: v.z * scale
    }
}

function cross(a, b) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.x * b.z - a.z * b.x,
        z: a.x * b.y - a.y * b.x,
    }
}

function isFacing(v0, v1, v2) {
    const a = {
        x: v1.x - v0.x,
        y: v1.y - v0.y,
        z: 0
    }

    const b = {
        x: v2.x - v0.x,
        y: v2.y - v0.y,
        z: 0
    }

    const c = cross(a, b)

    return c.z >= 0;
}

function zIndex(face) {
    return Math.max(face[0].z, face[1].z, face[2].z);
}