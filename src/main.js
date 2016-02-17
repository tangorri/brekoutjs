// BrekoutJS
// by Antoine Malpel
//
/////////////////////

(function main() {
    'use strict';
    console.log('init');


    var gamePaused = false;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    
    function drawBackground() {
        // draw backgound
        ctx.fillStyle = 'blue';
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }
    
    function draw() {
        drawBackground();
        
        if (gamePaused) {
            ctx.fillStyle = 'yellow';
            ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        }
    }

    function onWindowResize(event) {
        resizeCanvas(canvas, window.innerWidth, window.innerHeight);
        initDraw();
    }
    
    function resizeCanvas(canvas, width, height) {
        initDraw();
    }
    
    function initDraw() {
        canvas.width = window.innerWidth - 200;
        canvas.height = Math.round(canvas.width * 4 / 6);
        draw();
    }
    
    function appStart() {
        
    }
    
    function appResume(params) {
        gamePaused = false;
    }
    
    function appPause(params) {
        gamePaused = true;
    }
    
    function pauseApp() {
        gamePaused = true;
    }

    document.body.appendChild(canvas);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', function onKeyDown(event) {
        console.log('onkeydown ', event.key);
    });
    initDraw();

})();