document.addEventListener("keydown", (e) => {
    if (e.key in keys) keys[e.key] = true;
})

document.addEventListener("keyup", (e) => {
    if (e.key in keys) keys[e.key] = false;
})