import { Point, Line, Polygon, RRT} from './RRT.js';

let canvas;
let ctx;
let tree;

let interval;

document.addEventListener("DOMContentLoaded", function () {
    // do things after the DOM loads partially
    console.log("DOM is loaded");

    initCanvas();
});

// ==== Canvas stuff =====
// Starts the canvas
function initCanvas(){
    // Populates canvas var 
    canvas = document.getElementById("RRT-canvas");
    ctx = canvas.getContext("2d");

    // Set width and height
    canvas.width = document.body.clientWidth;
    console.log(canvas.width);
    canvas.height = document.body.clientHeight;

    // let lineA = new Line( new Point(100, 100), new Point(200, 200));
    // lineA.draw(ctx, 2, "red");

    // let lineB = new Line( new Point(200, 100), new Point(100, 200));
    // lineB.draw(ctx, 2, "red");

    // let intersectionPoint = lineA.intersect(lineB).point;
    // intersectionPoint.draw(ctx, 4, "green");
    

    // let poly = new Polygon( [new Point(100, 100), new Point(100,200), new Point(200, 200)] )

    // let testPoint = new Point(300, 200);
    // testPoint.draw(ctx, 5, "black");

    // poly.drawPoints(ctx, 5, "green");
    // poly.drawLines(ctx, 3, "blue");
    // poly.drawFill(ctx, "grey");3
    tree = new RRT([new Point(25, 25), new Point(canvas.width-25, canvas.height-25)], new Point(100, canvas.height/2), new Point(canvas.width - 100, canvas.height/2));
    
    tree.maxLength = 10;
    tree.goalProb = 0.01;

    let width = 720;
    let height = 620;
    
    let points = [];
    points.push(new Point(canvas.width/2 - width/2, (canvas.height + height)/2));
    points.push(new Point(canvas.width/2 + width/2, (canvas.height + height)/2));
    points.push(new Point(canvas.width/2 + width/2, (canvas.height - height)/2));
    points.push(new Point(canvas.width/2 - width/2, (canvas.height - height)/2));
    let obstacleA = new Polygon(points);

    tree.addObstacle(obstacleA);

    console.log("test");

    console.log(tree.done);

    interval = setInterval(sample, 10);
}

function sample(){
    ctx.fillStyle = "#F5F2F2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(!tree.done){
        //tree.obstacles[0].drawFill(ctx, "grey");

        tree.sample();
        tree.sample();
        tree.sample();
        tree.sample();
        tree.sample();
        //tree.sampleUntilFinish(1000);

        // Redraw tree
        let grey = "grey";
        tree.drawAllBranches(ctx, 3, grey);
        tree.drawAllNodes(ctx, 1, grey);

        tree.start.draw(ctx, 10, grey);
        tree.end.draw(ctx, 10, grey);
    }else{
        clearInterval(interval);

        let grey = "#C4C4C4";
        //tree.obstacles[0].drawFill(ctx, grey);

        tree.drawAllBranches(ctx, 2, grey);
        tree.drawAllNodes(ctx, 1, grey);

        console.log("backtracing")
        let parents = tree.backtrace(tree.end);

        parents.forEach( (branch) => {
            branch.draw(ctx, 5, "#00CAC3");
            branch.end.draw(ctx, 3, "#00CAC3")
        })

        tree.start.draw(ctx, 10, "grey");
        tree.end.draw(ctx, 10, "grey");
    }
}