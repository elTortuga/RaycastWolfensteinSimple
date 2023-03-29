var posx = 0;
var posy = 0;
var flagLeft = false;
var flagRight = false;
var flagUp = false;
var flagDown = false;
const CONSTANT_SPEED = .1;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 200;

window.onload = function () {
    main();
}

var lastRender = 0
var ctx;
function main() {
    setupEvents();
    canvasAndContext = setupCanvasCtx();
    console.log(canvasAndContext); 
    ctx = canvasAndContext.context
    
    window.requestAnimationFrame(loop)
}

function setupEvents() {
    document.addEventListener("keydown", (ev) => {
        const keyName = ev.key;
        if (keyName === "ArrowLeft") {
            flagLeft = true;
        }        
        if (keyName === "ArrowRight") {
            flagRight = true;
        }
        if (keyName === "ArrowUp") {
            flagUp = true;
        }
        if (keyName === "ArrowDown") {
            flagDown = true;
        }
        
        console.log("keydown: " + keyName);
    })
    document.addEventListener("keyup", (ev) => {
        const keyName = ev.key;
        if (keyName === "ArrowLeft") {
            flagLeft = false;
        }        
        if (keyName === "ArrowRight") {
            flagRight = false;
        }
        if (keyName === "ArrowUp") {
            flagUp = false;
        }
        if (keyName === "ArrowDown") {
            flagDown = false;
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
    if (flagDown) {
        posy += CONSTANT_SPEED * progress;
    }
    if (flagUp) {
        posy -= CONSTANT_SPEED * progress;
    }
    if (flagLeft) {
        posx -= CONSTANT_SPEED * progress;
    }
    if (flagRight) {
        posx += CONSTANT_SPEED * progress;
    }
}

function draw(ctx) {
    // clear the screen on each frame
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);

    // move box
    ctx.beginPath();
    ctx.rect(posx, posy, 10, 10);
    ctx.stroke();
}

function loop(timestamp) {
    const progress = (timestamp - lastRender)
    update(progress)
    draw(ctx)
    lastRender = timestamp
    window.requestAnimationFrame(loop)
}

