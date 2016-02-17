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

    var paddle = {
        size: {
            height: 20,
            width: 100,
        }
        , position: {
            x: 0,
            y: 0
        }
    };

    function draw() {
                
        // draw background
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // draw player's paddle
        ctx.fillStyle = 'yellow';
        ctx.fillRect(paddle.position.x, canvas.height - paddle.size.height - 50, paddle.size.width,
            paddle.size.height);

        if (gamePaused) {
            ctx.fillStyle = 'yellow';
            ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        }
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
                if (gamePaused) {
                    appResume();
                } else {
                    appPause();
                }
            }
        });

        initDraw();
        enableInGameListeners();
        requestAnimationFrame(draw);
    }

    function enableInGameListeners() {
        window.addEventListener('mousemove', paddleUpdateOnMouseMove);
    }
    
    function disableInGameListeners() {
        window.removeEventListener('mousemove', paddleUpdateOnMouseMove);
    }

    function paddleUpdateOnMouseMove(mouseEvent) {
        paddle.position.x = mouseEvent.clientX - paddle.size.width / 2;
        requestAnimationFrame(draw);
    }

    function appResume(params) {
        gamePaused = false;
        enableInGameListeners();
    }

    function appPause(params) {
        gamePaused = true;
        disableInGameListeners();
    }

    function pauseApp() {
        gamePaused = true;
    }

    appStart();

})();