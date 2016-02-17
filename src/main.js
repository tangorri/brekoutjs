// BrekoutJS
// by Antoine Malpel
//
/////////////////////

(function main() {
    'use strict';
    console.log('init');

    var upateIntervalID;
    var gamePaused = false;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var paddle = {
        size: { width: 100, height: 20 }
        , position: { x: 0, y: 0 }
    };

    var ball = {
        size: { width: 12, height: 12 }
        , position: { x: 0, y: 0 }
        , speed: { x: 1, y: 1 }
    };

    var mouseTarget = {
        x: null
        , y: null
    }

    function update() {
        paddle.position.x = mouseTarget.x - paddle.size.width / 2;
        
        ball.position.x += ball.speed.x;
        ball.position.y += ball.speed.y;
    }

    function draw() {
                
        // draw background
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // draw player's paddle
        ctx.fillStyle = 'yellow';
        ctx.fillRect(paddle.position.x, canvas.height - paddle.size.height - 50, paddle.size.width,
            paddle.size.height);
            
        // draw ball
        ctx.fillStyle = 'yellow';
        ctx.fillRect(ball.position.x, ball.position.y, ball.size.width, ball.size.height);

        if (gamePaused) {
            ctx.fillStyle = 'yellow';
            ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        }
        requestAnimationFrame(draw);
    }

    function onWindowResize(event) {
        resizeCanvas(canvas, window.innerWidth, window.innerHeight);
    }

    function resizeCanvas(canvas, width, height) {
        initDraw();
        requestAnimationFrame(draw);
    }

    function initDraw() {
        canvas.width = window.innerWidth - 200;
        canvas.height = Math.round(canvas.width * 4 / 6);
        draw();
    }

    function appStart() {
        document.body.appendChild(canvas);
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('keydown', function onKeyDown(keyboardEvent) {
            if (keyboardEvent.keyCode === 80) {
                gamePaused ? appResume() : appPause();
            }
        });

        initDraw();
        enableInGameListeners();
        requestAnimationFrame(draw);
    }

    function enableInGameListeners() {
        window.addEventListener('mousemove', paddleUpdateOnMouseMove);
        upateIntervalID = window.setInterval(update, 1000 / 60);
    }

    function disableInGameListeners() {
        window.removeEventListener('mousemove', paddleUpdateOnMouseMove);
        window.clearTimeout(upateIntervalID);
    }

    function paddleUpdateOnMouseMove(mouseEvent) {
        mouseTarget.x = mouseEvent.clientX;
    }

    function appResume(params) {
        gamePaused = false;
        enableInGameListeners();
    }

    function appPause(params) {
        gamePaused = true;
        disableInGameListeners();
    }

    appStart();

})();