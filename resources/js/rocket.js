let rocket = Object.create(null);

rocket.x = [4, 0, -3, 0, 0.1, 0];
rocket.u = [0, 0];

rocket.background = function(ctx, canvas){
    ctx.fillStyle = "rgb(15,15,20)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

rocket.draw = function(ctx, canvas){
    rocket.background(ctx, canvas);

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
}

rocket.x_dot = function(x, u){
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
}

rocket.controller = function(sp){
    let K1 = [-10.000, -20.3712, 0, 0, -107.4934, -25.7836];
    let K2 = [0, 0, -14.142, -21.979, 0, 0];

    let x = rocket.x
    
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

    rocket.u = u;
}

rocket.sim = function(dt){
    let xdot = this.x_dot(this.x, this.u);

    // x[n + 1] = x[n] + x_dot * dt
    let new_x = this.x.map(function(num, idx) {
        return num + xdot[idx]*dt
    });

    //console.log(new_x)

    rocket.x = new_x;
}

export default rocket;