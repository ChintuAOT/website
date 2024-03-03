import rocket from "./rocket.js";
import cartpole from "./cartpole.js";

let canvas;
let ctx;

let subtitle;

let system;

document.addEventListener("DOMContentLoaded", function () {
    // do things after the DOM loads partially
    console.log("DOM is loaded");

    initTopCanvas();
});

// ===== Mouse movement stuff =====
let mouse = {
    x:0,
    y:0
}

window.onmousemove = function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

// ==== Top Canvas stuff =====
// Starts the canvas
function initTopCanvas(){
    // Populates canvas var 
    canvas = document.getElementById("main-canvas");
    ctx = canvas.getContext("2d");

    subtitle = document.getElementById("subtitle");

    // Set width and height
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    system = rocket;

    animate();
}

let type = 'cartpole';

let start;
let prevElapsed = 0;

function animate(timestamp){
    if (start === undefined)
        start = timestamp
    const elapsed = timestamp - start;
    let delta_s = (elapsed - prevElapsed) / 1000;

    if(isNaN(delta_s)){
        delta_s = 0;
    }

    system.draw(ctx, canvas);
    system.controller([mouse.x/100, -mouse.y/100], canvas);
    system.sim(delta_s*1.2);

    prevElapsed = elapsed;
    requestAnimationFrame(animate);
}