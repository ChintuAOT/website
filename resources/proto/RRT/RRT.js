

// Generates a random sample from a given space.
// accepts a "bounds" input as follows:
// {xmin: -, xmax: -, ymin: -, ymax: -}
function rand2D(bounds){

    return Point(0, 0);
};

class Point{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distance(pointB) {
        return Math.sqrt((this.x - pointB.x)**2 + (this.y - pointB.y)**2)
    }

    draw(ctx, radius, color){
        ctx.beginPath();
        ctx.arc(this.x, this.y,radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    }

    equals(pointB){
        //return this.x == pointB.x && this.y - pointB.y;
        return Math.abs(this.x - pointB.x) < 0.000001 && Math.abs(this.x - pointB.x) < 0.000001;
    }
}

class Line{
    constructor(startPoint, endPoint) {
        this.start = startPoint;
        this.end = endPoint;
    }

    length() {
        return this.start.distance(this.end);
    }

    pointTowards(targetPoint) {
        // Saves length
        let length = this.length();
        // Sets end point as the target point
        this.end = targetPoint;
        // Sets length to original length
        this.setLength(length);
    }

    getLength(){
        return this.start.distance(this.end);
    }

    setLength(desiredLength) {
        let currentLength = this.length();
        let ratio = desiredLength / currentLength;

        this.end.x = (this.end.x - this.start.x) * ratio + this.start.x;
        this.end.y = (this.end.y - this.start.y) * ratio + this.start.y;
    }

    // Gets the line slope in y = mx + b
    // Returns Infinity if vertical
    getSlope() {
        return (this.end.y - this.start.y) / (this.end.x- this.start.x);
    }

    // Gets the constant offset term in y = mx + b
    getOffset() {
        let slope = this.getSlope()

        return - (this.start.x * slope) + this.start.y;
    }

    getIntersectionPoint(lineB) {
        let slopeA = this.getSlope();
        let slopeB = lineB.getSlope();

        let offsetA = this.getOffset();
        let offsetB = lineB.getOffset();

        let x = 0;
        let y = 0;
        
        // If A is vertical
        if(Math.abs(slopeA) == Infinity){
            x = this.start.x;
            y = x * slopeB + offsetB;

        // If B is vertical
        }else if(Math.abs(slopeB) == Infinity){
            x = lineB.start.x;
            y = x * slopeA + offsetA;

        // Otherwise
        } else {
            // Calculate the x intersection point
            x = (offsetB - offsetA) / (slopeA - slopeB);

            // Calculate the y intersection point
            y = x * slopeA + offsetA;
        }

        return new Point(x, y);
    }

    // Assuming the point is on the line, checks
    // if it is between the start and end point using a rectangle
    isBetweenPoints(point){
        let lx = Math.abs(this.start.x - this.end.x);
        let ly = Math.abs(this.start.y - this.end.y);

        let inX = Math.abs(point.x - this.start.x) <= lx && Math.abs(point.x - this.end.x) <= lx;
        let inY = Math.abs(point.y - this.start.y) <= ly && Math.abs(point.y - this.end.y) <= ly;

        return inX && inY;
    }

    intersect(line){
        let intersectionPoint = this.getIntersectionPoint(line);
        let onLineA = this.isBetweenPoints(intersectionPoint);
        let onLineB = line.isBetweenPoints(intersectionPoint);

        return {intersect: onLineA && onLineB, point: intersectionPoint};
    }

    draw(ctx, width, color){

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(this.start.x, this.start.y)
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
    }

    drawPoints(ctx, radius, color){
        this.start.draw(ctx, radius, color);
        this.end.draw(ctx, radius, color);
    }
}

class Polygon{
    constructor(points){
        this.points = points;
        this.lines = [];

        // Create lines
        for(let i = 0; i < points.length-1; i++){
            this.lines.push(new Line(points[i], points[i + 1]));
        }

        // Enclose
        this.lines.push(new Line(points[points.length - 1], points[0]));
    }

    // Return all intersections (even if they are not valid)
    getAllIntersections(lineB){
        let intersections = [];
        // Loop through poly lines and add intersection to array
        this.lines.forEach(function(line, index){
            intersections.push(line.intersect(lineB));
        })

        return intersections;
    }

    // Get only valid intersections
    getIntersections(lineB){
        // Get all intersections
        let allIntersections = this.getAllIntersections(lineB);
        // Filter to only valid intersections
        let intersections = allIntersections.filter( (intersection) => intersection.intersect);

        return intersections;
    }

    getClosestIntersection(lineB){
        let intersections = this.getIntersections(lineB);

        if(intersections.length == 0){
            return lineB.end;
        }

        let point;
        let shortestDist = Infinity;
        let distance;
        intersections.forEach( (intersection) => {
            distance = intersection.point.distance(lineB.start);

            if(distance < shortestDist){
                shortestDist = distance;
                point = intersection.point;
            }
        });

        let lineC = new Line(lineB.start, point);
        lineC.setLength(shortestDist * 0.5);

        return lineC.end;
    }
    
    //
    isInside(point){
        // The +100 is very bad but will work for now
        let line = new Line(point, new Point(point.x + 1000, point.y));

        //console.log(line);

        let intersections = this.getIntersections(line);

        //console.log(intersections);

        if(intersections.length % 2 == 0) {
            return false;
        } else {
            return true;
        }
    }

    drawPoints(ctx, radius, color){
        this.points.forEach((point, index) => {
            point.draw(ctx, radius, color);
        })
    }

    drawLines(ctx, width, color){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(this.points[0].x, this.points[0].y);

        this.points.forEach((point, index) => {
            ctx.lineTo(point.x, point.y);
        })

        ctx.lineTo(this.points[0].x, this.points[0].y);

        ctx.stroke();
    }

    drawFill(ctx, color){
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(this.points[0].x, this.points[0].y);

        this.points.forEach((point, index) => {
            ctx.lineTo(point.x, point.y);
        })

        ctx.lineTo(this.points[0].x, this.points[0].y);
        ctx.fill();
    }
}

class RRT{
    constructor(bounds, start, end, obstacles = []) {
        this.lowerBound = bounds[0];
        this.upperBound = bounds[1];

        this.start = start;
        this.end = end;

        this.obstacles = obstacles;

        // Sample points
        this.nodes = [];
        // Tree of lines
        this.tree = [];

        // Reached goal?
        this.done = false;

        this.goalProb = 0.1;
        this.maxLength = 100;
    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
    }

    genRandomPoint(){
        let x = Math.random() * (this.upperBound.x - this.lowerBound.x) + this.lowerBound.x;
        let y = Math.random() * (this.upperBound.y - this.lowerBound.y) + this.lowerBound.y;
        return new Point(x, y);
    }

    findClosestNode( point ){
        let closestPoint;
        let shortestDist = Infinity;
        let dist = 0;
        this.nodes.forEach( (treeNode) => {
            dist = treeNode.distance(point)
            if(dist < shortestDist){
                shortestDist = dist;
                closestPoint = treeNode;
            }
        });

        // Check start point
        dist = this.start.distance(point)
        if(dist < shortestDist){
            shortestDist = dist;
            closestPoint = this.start;
        }

        // // Check end point
        // dist = this.end.distance(point)
        // if(dist < shortestDist){
        //     shortestDist = dist;
        //     closestPoint = this.end;
        // }

        return closestPoint;
    }

    // Finds the parent branch of a given node
    findParentBranch(node){
        let parentBranch;
        this.tree.forEach( (branch) => {
            if(branch.end.equals(node) && !branch.end.equals(branch.start)){
                parentBranch = branch;
            }
        })

        return parentBranch;
    }

    // Traces the tree back to its starting point and returns all branches
    backtrace(node){
        let parentStart = node;
        let branches = [];
        let maxTries = this.tree.length; // Prevent explosion
        let count = 0;
        while(!parentStart.equals(this.start)){
            let parentBranch = this.findParentBranch(parentStart);
            parentStart = parentBranch.start;
            branches.push(parentBranch);

            count ++;
            if(count > maxTries){
                break;
            }
        }
        // console.log(parentStart);

        return branches;
    }

    sample(newPoint = this.genRandomPoint()){


        // Sample goal with that probability
        if(Math.random() < this.goalProb){
            newPoint = this.end;
            // console.log("Sampling Goal!")
        }

        // Check all polys for intersection
        let inside = false;
        this.obstacles.forEach((poly) => {
            if(poly.isInside(newPoint)){
                inside = true;
            }
        });

        // Stop and return false if inside
        if(inside){
            return {point: newPoint, hit: true};
        }
        
        // Find closest node
        let closestNode = this.findClosestNode(newPoint);

        // Create new branch
        let treeBranch = new Line(closestNode, new Point(newPoint.x, newPoint.y));

        // Set maxbranch length
        if(treeBranch.length() > this.maxLength){
            treeBranch.setLength(this.maxLength);
        }

        // Cut branch if it passes through obsticle 
        this.obstacles.forEach((poly) => {
            treeBranch.end = poly.getClosestIntersection(treeBranch);
        });


        // Check if we have finished
        if(treeBranch.end.equals(this.end)){
            // console.log("finishing")
            this.done = true;
        }

        // Set a min length
        if(treeBranch.getLength() > 5){
            // Extend tree
            this.tree.push(treeBranch);
            this.nodes.push(treeBranch.end);
        }

        return {point: newPoint, hit: false, done: this.done};
    }

    sampleUntilFinish(maxIter){
        let finished = false;
        let iter = 0;
        while(!finished && iter < maxIter){
            finished = this.sample().done;
            iter ++;
        }
    }

    drawAllNodes(ctx, radius, color){
        this.nodes.forEach((point) => {
            point.draw(ctx, radius, color)
        })
    }

    drawAllBranches(ctx, width, color){
        this.tree.forEach((line) => {
            line.draw(ctx, width, color)
        })
    }

    reset(){
        this.nodes = [];
        this.tree = [];

        this.done = false;
    }
}

// let testPoint = new Point(0.6, 1.5);
// let lineA = new Line( new Point(0.6, 0.5), new Point(100.6, 0.5));
// let poly = new Polygon( [new Point(0, 0), new Point(1,0), new Point(1, 1)] )


export { Point, Line, Polygon, RRT };

//debugger;