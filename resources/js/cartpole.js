let cartpole = Object.create(null);

cartpole.x = [0, 0, Math.PI, 0];
cartpole.u = [0];

let edgeSpacing = 150;

cartpole.background = function(ctx, canvas){
    ctx.fillStyle = "#CCE3EF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
},

cartpole.draw = function(ctx, canvas){
    this.background(ctx, canvas);

    let x = this.x;
    let u = this.u;

    ctx.strokeStyle = "#B2B2B2";
    ctx.lineWidth = 6;

    let height = 150;

    ctx.beginPath();
    ctx.moveTo(edgeSpacing, canvas.height - height);
    ctx.lineTo(canvas.width - edgeSpacing, canvas.height - height);
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

cartpole.x_dot = function(x, u){
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

cartpole.controller = function(sp, canvas){
    let K = [-31.6228, -67.9745, 432.8464, 116.7668];
    let x = this.x;

    sp[0] = sp[0] - (canvas.width/100)/2;

    let trackWidth = (canvas.width - (edgeSpacing*2) - 60)/100;

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

cartpole.sim = function(dt){
    let xdot = this.x_dot(this.x, this.u);

    // x[n + 1] = x[n] + x_dot * dt
    let new_x = this.x.map(function(num, idx) {
        return num + xdot[idx]*dt
    });

    //console.log(new_x)

    this.x = new_x;
}

export default cartpole;