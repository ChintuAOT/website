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
    canvas = document.getElementById("canvas");
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
    tree = new RRT([new Point(0, 0), new Point(1500, 700)], new Point(100, 100), new Point(1300, 500));
    
    
    let points = [];
    let offset = 300;
    let vOffset = 100;
    points.push(new Point(300 + offset, 150 + vOffset));
    points.push(new Point(300 + offset, 300 + vOffset));
    points.push(new Point(500 + offset, 300 + vOffset));
    points.push(new Point(500 + offset, 400 + vOffset));
    points.push(new Point(200 + offset, 400 + vOffset));
    points.push(new Point(200 + offset, 50 + vOffset));
    points.push(new Point(500 + offset, 50 + vOffset));
    points.push(new Point(500 + offset, 200 + vOffset));
    points.push(new Point(500 + offset, 300 + vOffset));
    points.push(new Point(400 + offset, 300 + vOffset));
    points.push(new Point(400 + offset, 150 + vOffset));
    points.push(new Point(300 + offset, 150 + vOffset));
    let obstacleA = new Polygon(points);

    tree.addObstacle(obstacleA);

    points = [];
    points.push(new Point(300, 50 + vOffset));
    points.push(new Point(300, 300 + vOffset));
    points.push(new Point(400, 300 + vOffset));
    points.push(new Point(400, 400 + vOffset));
    points.push(new Point(200, 400 + vOffset));
    points.push(new Point(200, 50 + vOffset));
    points.push(new Point(300, 50 + vOffset));
    let obstacleB = new Polygon(points);
    tree.addObstacle(obstacleB);

    points = [];
    offset = 700;
    points.push(new Point(300 + offset, 50 + vOffset));
    points.push(new Point(300 + offset, 300 + vOffset));
    points.push(new Point(400 + offset, 300 + vOffset));
    points.push(new Point(400 + offset, 400 + vOffset));
    points.push(new Point(200 + offset, 400 + vOffset));
    points.push(new Point(200 + offset, 50 + vOffset));
    points.push(new Point(300 + offset, 50 + vOffset));
    let obstacleC = new Polygon(points);
    tree.addObstacle(obstacleC);


    // Bounds and start + goal points
    tree.upperBound.draw(ctx, 5, "black");
    tree.lowerBound.draw(ctx, 5, "black");

    tree.start.draw(ctx, 5, "red");
    tree.end.draw(ctx, 5, "green");

    console.log("test");

    console.log(tree.done);

    interval = setInterval(sample, 50);
    // interval2 = setInterval(fullSample, 50);
}

function multiSample(){
    sample();
}

function fullSample(){
    ctx.fillStyle = "rgb(15, 15, 10)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    tree.reset();
    tree.end = new Point(mouse.x, mouse.y);
    tree.sampleUntilFinish(5000);

    tree.obstacles[0].drawFill(ctx, "grey");
    tree.obstacles[1].drawFill(ctx, "grey");

    //tree.drawAllBranches(ctx, 3, "blue");
    //tree.drawAllNodes(ctx, 2, "blue");

    console.log("backtracing")
    let parents = tree.backtrace(tree.end);

    parents.forEach( (branch) => {
        branch.draw(ctx, 5, "orange");
        branch.end.draw(ctx, 3, "orange")
    })

    tree.start.draw(ctx, 10, "red");
    tree.end.draw(ctx, 10, "green");
}

function sample(){
    ctx.fillStyle = "rgb(15, 15, 10)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(!tree.done){
        tree.obstacles[0].drawFill(ctx, "grey");
        tree.obstacles[1].drawFill(ctx, "grey");
        tree.obstacles[2].drawFill(ctx, "grey");

        tree.sample();
        //tree.sampleUntilFinish(1000);

        // Redraw tree
        tree.drawAllBranches(ctx, 3, "white");
        tree.drawAllNodes(ctx, 1, "white");

        tree.start.draw(ctx, 10, "red");
        tree.end.draw(ctx, 10, "green");
    }else{
        clearInterval(interval);

        tree.obstacles[0].drawFill(ctx, "grey");
        tree.obstacles[1].drawFill(ctx, "grey");
        tree.obstacles[2].drawFill(ctx, "grey");

        tree.drawAllBranches(ctx, 3, "blue");
        tree.drawAllNodes(ctx, 2, "blue");

        console.log("backtracing")
        let parents = tree.backtrace(tree.end);

        parents.forEach( (branch) => {
            branch.draw(ctx, 5, "orange");
            branch.end.draw(ctx, 3, "orange")
        })

        tree.start.draw(ctx, 10, "red");
        tree.end.draw(ctx, 10, "green");
    }
}