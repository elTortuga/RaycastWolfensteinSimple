const CONSTANT_SPEED = .004;
const CONSTANT_ANGLE_SPEED = .025;
const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 1200;
const DEPTH = 20;
const FIELD_OF_VIEW = Math.PI / 4;
const MAP_HEIGHT = 16;
const MAP_WIDTH = 16;
const HORIZONTAL_RECTANGLES = 120
const VERTICAL_RECTANGLES = 40
const RECT_HEIGHT = CANVAS_HEIGHT / VERTICAL_RECTANGLES;
const RECT_WIDTH = CANVAS_WIDTH / HORIZONTAL_RECTANGLES;

var posX = 8;
var posY = 8;
var angle = 0.0;
// var angle = Math.PI * .25;

var flagLeft = false;
var flagRight = false;
var flagUp = false;
var flagDown = false;
var flagStrafeLeft = false;
var flagStrafeRight = false;

var ctx;
var lastRender = 0
var map ="";

window.onload = function () {
    main();
}

function main() {
    setupEvents();
    canvasAndContext = setupCanvasCtx();
    console.log(canvasAndContext); 
    ctx = canvasAndContext.context

    map += "################";
    map += "#...#..........#";
    map += "#..............#";
    map += "#..............#";
    map += "#..............#";
    map += "#...........#..#";
    map += "#...........#..#";
    map += "#...........#..#";
    map += "#..............#";
    map += "#..............#";
    map += "#..............#";
    map += "#####..........#";
    map += "#..............#";
    map += "#..............#";
    map += "#..............#";
    map += "################";
    
    window.requestAnimationFrame(loop)
}

function setupEvents() {
    document.addEventListener("keydown", (ev) => {
        const keyName = ev.key;
        if (keyName === "ArrowLeft" || keyName === 'a') {
            flagLeft = true;
        }        
        if (keyName === "ArrowRight" || keyName === 'd') {
            flagRight = true;
        }
        if (keyName === "ArrowUp" || keyName === 'w') {
            flagUp = true;
        }
        if (keyName === "ArrowDown" || keyName === 's') {
            flagDown = true;
        }
        if (keyName === "q") {
            flagStrafeLeft = true;
        }
        if (keyName === "e") {
            flagStrafeRight = true;
        }
        
        console.log("keydown: " + keyName);
    })
    document.addEventListener("keyup", (ev) => {
        const keyName = ev.key;
        if (keyName === "ArrowLeft" || keyName === 'a') {
            flagLeft = false;
        }        
        if (keyName === "ArrowRight" || keyName === 'd') {
            flagRight = false;
        }
        if (keyName === "ArrowUp" || keyName === 'w') {
            flagUp = false;
        }
        if (keyName === "ArrowDown" || keyName === 's') {
            flagDown = false;
        }
        if (keyName === "q") {
            flagStrafeLeft = false;
        }
        if (keyName === "e") {
            flagStrafeRight = false;
        }
        
        console.log("keyup: " + keyName);
    })
}

function setupCanvasCtx() {
    const canvas = document.createElement("canvas");

    canvas.id       = "myCanvas";
    canvas.width    = CANVAS_WIDTH;
    canvas.height   = CANVAS_HEIGHT;
    canvas.style;
    canvas.style.position = "absolute";
    canvas.style.border = "1px solid #000000";

    let body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas)

    let ctx = canvas.getContext("2d");
    
    return  {canvas: canvas, context: ctx};
}

function update(progress) {
    if (flagUp) {
        posX += (CONSTANT_SPEED * progress) * Math.cos(angle);
        posY += (CONSTANT_SPEED * progress) * Math.sin(angle);
    }
    if (flagDown) {
        posX -= (CONSTANT_SPEED * progress) * Math.cos(angle);
        posY -= (CONSTANT_SPEED * progress) * Math.sin(angle);
    }
    if (flagLeft) {
        angle -= .05 * CONSTANT_ANGLE_SPEED * progress;
    }
    if (flagRight) {
        angle += .05 * CONSTANT_ANGLE_SPEED * progress;
    }
    if (flagStrafeLeft) {
        posX += (CONSTANT_SPEED * progress) * Math.sin(angle);
        posY -= (CONSTANT_SPEED * progress) * Math.cos(angle);
    }
    if (flagStrafeRight) {
        posX -= (CONSTANT_SPEED * progress) * Math.sin(angle);
        posY += (CONSTANT_SPEED * progress) * Math.cos(angle);
    }
}

function draw(ctx, progress) {
    // clear the screen on each frame
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    console.log("drawing");
    
    
    // fill floor
    for (let i = 0; i < 16; i++) {
        let c = Math.floor(255 * i/16);   
        console.log(`${c}`);   
        ctx.fillStyle = `rgb(${c},${c} ,${c})`;
        ctx.fillRect(
            0, 
            // CANVAS_HEIGHT/2 + (i * (VERTICAL_RECTANGLES / 16) * RECT_HEIGHT),
            CANVAS_HEIGHT/2 + (i * (VERTICAL_RECTANGLES / 16) * RECT_HEIGHT),
            CANVAS_WIDTH,
            (VERTICAL_RECTANGLES / 16) * RECT_HEIGHT +1
        );
    }
    
    for (let x = 0; x < HORIZONTAL_RECTANGLES; x++) {
        console.log("outerLoop: " + x);
        let rayAngle = (angle - FIELD_OF_VIEW/2) + (x/HORIZONTAL_RECTANGLES) * FIELD_OF_VIEW;
        let stepSize = 0.1;
        let distanceToWall = 0;
        let hitWall = false;
        let boundary = false;

        let eyeX =  Math.cos(rayAngle);
        let eyeY =  Math.sin(rayAngle);
        // let eyeX =  -   Math.cos(rayAngle);
        // let eyeY =  -   Math.sin(rayAngle);

        while (!hitWall && distanceToWall < DEPTH) {
            distanceToWall += stepSize;
            let testX = Math.floor(posX + eyeX * distanceToWall);
            let testY = Math.floor(posY + eyeY * distanceToWall);

            if (testX < 0 || testX > MAP_WIDTH+1 || testY < 0 || testY > MAP_HEIGHT+1) {
                hitWall = true;
                distanceToWall = DEPTH
            } else {
                // if (map[testY * HORIZONTAL_RECTANGLES + testX] === '#') {
                //     hitWall = true;
                // }
                if (map[testY * MAP_WIDTH + testX] === '#') {
                    hitWall = true;
                }
            }
        }
        // calculate distance to ceiling and floor
        let ceiling = VERTICAL_RECTANGLES / 2 - VERTICAL_RECTANGLES / distanceToWall;
        let floor = VERTICAL_RECTANGLES - ceiling;

        // fill ceiling
        ctx.fillStyle = "#333333";
        ctx.fillRect(x*RECT_WIDTH, 0, RECT_WIDTH, RECT_HEIGHT * ceiling);
        // fill wall
        if (distanceToWall < 3) {
            ctx.fillStyle = "#1111FF";
        } else if (distanceToWall < 4) {
            ctx.fillStyle = "#1111EE";
        } else if (distanceToWall < 5) {
            ctx.fillStyle = "#1111DD";
        } else if (distanceToWall < 6) {
            ctx.fillStyle = "#1111CC";
        } else if (distanceToWall < 7) {
            ctx.fillStyle = "#1111BB";
        } else if (distanceToWall < 8) {
            ctx.fillStyle = "#1111AA";
        } else if (distanceToWall < 9) {
            ctx.fillStyle = "#111199";
        } else if (distanceToWall < 10) {
            ctx.fillStyle = "#111188";
        } else if (distanceToWall < 11) {
            ctx.fillStyle = "#111177";
        } else if (distanceToWall < 12) {
            ctx.fillStyle = "#111166";
        } else if (distanceToWall < 13) {
            ctx.fillStyle = "#111155";
        } else if (distanceToWall < 14) {
            ctx.fillStyle = "#111144";
        } else if (distanceToWall < 15) {
            ctx.fillStyle = "#111133";
        } else {
            ctx.fillStyle = "#111122";
        }
        ctx.fillRect(x*RECT_WIDTH, RECT_HEIGHT * ceiling, RECT_WIDTH, CANVAS_HEIGHT - (RECT_HEIGHT * ceiling) *2 );
        
    }
    
    // info
    ctx.fillStyle = "#FF2222";
    ctx.fillRect(CANVAS_WIDTH-100, 0, 100, 70);
    ctx.fillStyle = '#000000'
    ctx.font = "14px mono";
    ctx.fillText("posX: " + posX, CANVAS_WIDTH-100, 14);
    ctx.fillText("posY: " + posY, CANVAS_WIDTH-100, 28);
    ctx.fillText("angle: " + (angle / Math.PI * 180) % 360, CANVAS_WIDTH-100, 42);
    ctx.fillText("FPS:   " + 1/ (progress * .001), CANVAS_WIDTH-100, 58);
    

    //mini map
    ctx.fillStyle = "#22FF22";
    ctx.fillRect(0, 0, 160, 160);
    ctx.fillStyle = '#000000';    
    for (let i = 0; i < MAP_WIDTH; i++) {
        for (let j = 0; j < MAP_WIDTH; j++) {
            if ( map[j * MAP_WIDTH + i] === '#' ) {                
                ctx.fillRect(i*10,j*10, 10, 10) ;
            }
        }
    }    
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(posX*10-5, posY*10-5, 5, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(posX*10-5, posY*10-5);
    ctx.lineTo(posX*10-5 + 20 * Math.cos(angle), posY*10-5 +20 * Math.sin(angle));
    ctx.stroke();
}

function loop(timestamp) {
    const progress = (timestamp - lastRender)
    update(progress)
    draw(ctx, progress)
    lastRender = timestamp
    window.requestAnimationFrame(loop)
}

