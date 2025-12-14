/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const centerWidth = canvasWidth / 2;
const centerHeight = canvasHeight / 2

const speed = 2.5;
const rotationspeed = .01;
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
