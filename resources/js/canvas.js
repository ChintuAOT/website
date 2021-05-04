
let canvas;
let ctx;

let subtitle;

document.addEventListener("DOMContentLoaded", function () {
    // do things after the DOM loads partially
    console.log("DOM is loaded");

    initCanvas();
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

// ==== Canvas stuff =====
// Starts the canvas
function initCanvas(){
    // Populates canvas var 
    canvas = document.getElementById("main-canvas");
    ctx = canvas.getContext("2d");

    subtitle = document.getElementById("subtitle");

    // Set width and height
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    // Draw background
    //background();

    console.log("Test");

    animate();
}

let type = 'cartpole';

function animate(){

    if(type == 'cartpole'){
        cartpole.draw();
        cartpole.controller([(mouse.x - (canvas.width)/2)/100]);
        cartpole.sim(0.02);

        subtitle.style.color = "#1F1F1F";
    }else if(type == 'rocket'){
        rocket.draw();
        rocket.controller([mouse.x/100, -mouse.y/100]);
        rocket.sim(0.02);
    }

    //console.log("animating");
    requestAnimationFrame(animate);
}

let cartpole = {
    x: [0, 0, Math.PI, 0],
    u: [0],

    background: function(){
        ctx.fillStyle = "#CCE3EF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    draw: function(){
        this.background();

        let x = this.x;
        let u = this.u;

        ctx.strokeStyle = "#B2B2B2";
        ctx.lineWidth = 6;

        let height = 150;

        ctx.beginPath();
        ctx.moveTo(100, canvas.height - height);
        ctx.lineTo(canvas.width - 100, canvas.height - height);
        ctx.stroke();

        ctx.save();
        ctx.translate(x[0] * 100 + canvas.width/2, canvas.height - height);

        ctx.fillStyle = "#5A5A5A";
        ctx.fillRect(-30, -15, 60, 30);

        ctx.save();
        ctx.rotate(x[2]);

        ctx.fillStyle = "#8154FD";

        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillRect(-6, 0, 12, 150);

        ctx.restore();

        ctx.restore();
    },

    x_dot: function(x, u){
        const m = 1;
        const M = 3;
        const L = 0.5;
        const g = -10;
        const b = 1;

        let x_dot = [0, 0, 0, 0];

        let secondHalf = (m * (g * Math.cos(x[2]) - L * x[3]**2) * Math.sin(x[2]) + u[0]) / (M + m * Math.sin(x[2])**2);

        x_dot[0] = x[1];
        x_dot[1] = secondHalf;

        x_dot[2] = x[3];
        x_dot[3] = (g * Math.sin(x[2]))/L + (Math.cos(x[2])/L) * secondHalf - b * x[3];

        return x_dot;
    },

    controller: function(sp){
        K = [-31.6228, -67.9745, 432.8464, 116.7668];
        let x = this.x;

        let trackWidth = (canvas.width - 200 - 60)/100;

        if(sp[0] > trackWidth/2){
            sp[0] = trackWidth/2;
        }else if(sp[0] < -trackWidth/2){
            sp[0] = -trackWidth/2;
        }

        if(Math.abs(x[2] - Math.PI) > Math.PI/2){
            this.x = [0, 0, Math.PI, 0];
        }

        this.u[0] = -K[0] * (x[0] - sp[0]) - K[1] * x[1] + K[2] * (x[2] - Math.PI) + K[3] * x[3];
    },

    sim: function(dt){
        let xdot = this.x_dot(this.x, this.u);

        // x[n + 1] = x[n] + x_dot * dt
        let new_x = this.x.map(function(num, idx) {
            return num + xdot[idx]*dt
        });

        //console.log(new_x)

        this.x = new_x;
    }
}

let rocket = {
    x: [4, 0, -3, 0, 0.1, 0],
    u: [0, 0],

    background: function(){
        ctx.fillStyle = "rgb(15,15,20)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    draw: function(){
        this.background();

        let x = this.x;
        let u = this.u;

        ctx.save();
        ctx.translate(x[0] * 100, -x[2] * 100);
        ctx.rotate(x[4]);
        
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(15, 40);
        ctx.lineTo(0, 35);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(-15, 40);
        ctx.lineTo(0, 35);
        ctx.stroke();
        
        ctx.fillStyle = "white";
        ctx.fillRect(-2.5, -45, 5, 80);
        
        ctx.fillStyle = "white";
        ctx.fillRect(-2.5, 10, 5, 25);
        ctx.fillRect(-2.5, -35, 5, 10);
        
        //ctx.fillRect(-45, -15, 30, 5);
        //ctx.fillRect(15, -15, 30, 5);
        
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 2 * Math.random() + 3;
          
        ctx.shadowColor = 'orange';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(u[0]/5 + Math.random()*1, 40 + u[1]/5 + Math.random()*20);
        ctx.stroke();
        
        
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2 * Math.random() + 1;
        
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(u[0]/8 + Math.random()*1, 40 + u[1]/8 + Math.random()*20);
        ctx.stroke();
        
        ctx.restore();
    },

    x_dot: function(x, u){
        const m = 10;
        const g = 10;
        const I = 100;
        const L = 30;
        
        let x_dot = [0, 0, 0, 0, 0, 0];
        
        x_dot[0] = x[1];
        x_dot[1] = ((u[0]) * Math.cos(x[4]) + (u[1]) * Math.sin(x[4])) / m;
        
        x_dot[2] = x[3];
        x_dot[3] = (u[0] * Math.sin(x[4]) + (u[1]) * Math.cos(x[4]))/ m - g;
        
        x_dot[4] = x[5];
        x_dot[5] = (u[0] * L) / I;

        return x_dot;
    },

    controller: function(sp){
        K1 = [-10.000, -20.3712, 0, 0, -107.4934, -25.7836]
        K2 = [0, 0, -14.142, -21.979, 0, 0]

        let x = this.x
        
        let u = []
        
        u[0] = (x[0] - sp[0]) * K1[0] + x[1] * K1[1] + (x[2] - sp[1]) * K1[2] + x[3] * K1[3] + x[4] * K1[4] + x[5] * K1[5] + 0
        
        u[1] = (x[0]  - sp[0]) * K2[0] + x[1] * K2[1] + (x[2] - sp[1]) * K2[2] + x[3] * K2[3] + x[4] * K2[4] + x[5] * K2[5] + 100 
        
        if(u[0] < -2000){
          u[0] = -2000
        }else if(u[0] > 2000){
          u[0] = 2000
        }
        
        if(u[1] < 0){
          u[1] = 0
        }else if(u[1] > 5000){
          u[1] = 5000
        }

        this.u = u;
    },

    sim: function(dt){
        let xdot = this.x_dot(this.x, this.u);

        // x[n + 1] = x[n] + x_dot * dt
        let new_x = this.x.map(function(num, idx) {
            return num + xdot[idx]*dt
        });

        //console.log(new_x)

        this.x = new_x;
    }
}