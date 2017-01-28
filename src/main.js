// BrekoutJS
// by Tangorri
//
/////////////////////

(function main() {
  'use strict';

  var upateIntervalID;
  var gamePaused = false;

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  var paddle = {
    size: { width: 100, height: 20 }
    , position: { x: 0, y: canvas.height - 50 }
  };

  var ball = {
    size: { width: 12, height: 12 }
    , position: { x: 0, y: 0 }
    , speed: { x: 1, y: 1 }
    , impacts: 0
  };

  var bricks = [];

  var mouseTarget = { x: null, y: null };

  function update() {
    paddle.position.x = mouseTarget.x - paddle.size.width / 2;
    if (paddle.position.x < 0) {
      paddle.position.x = 0;
    } else if (paddle.position.x + paddle.size.width > canvas.width) {
      paddle.position.x = canvas.width - paddle.size.width;
    }

    // collision with screen
    if (ball.speed.x > 0 && ball.position.x + ball.size.width >= canvas.width) {
      ball.speed.x *= -1;
      ballImpact(ball);
    } else if (ball.position.x <= 0 && ball.speed.x < 0) {
      ball.speed.x *= -1;
      ballImpact(ball);
    }

    if (ball.position.y < 0 && ball.speed.y < 0) {
      ball.speed.y *= -1;
      ballImpact(ball);
    } else if (ball.position.y > canvas.height) {
      ballLost(ball);
    } else if (ball.speed.y > 0 &&
      (ball.position.y + ball.size.height > paddle.position.y) &&
      (ball.position.x + ball.size.width > paddle.position.x) &&
      (ball.position.x - ball.size.width) < paddle.position.x + paddle.size.width) {
      ball.speed.y *= -1;
      ballImpact(ball);
    } else {
      // with bricks
      for (var brickIndex = 0; brickIndex < bricks.length; ++brickIndex) {
        var brick = bricks[brickIndex];

        // Ball and Brick HitTest.
        if (ball.position.x > brick.position.x &&
          ball.position.x + ball.size.width < brick.position.x + brick.size.width &&
          ball.position.y > brick.position.y &&
          ball.position.y + ball.size.height < brick.position.y + brick.size.height) {

          // Remove Collided Brick and escape loop.
          // Only one brick disappear at time.
          bricks.splice(brickIndex, 1);
          break;
        }
      }
    }

    ball.position.x += ball.speed.x;
    ball.position.y += ball.speed.y;
  }

  function draw() {

    // draw background
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw player's paddle
    ctx.fillStyle = 'yellow';
    ctx.fillRect(paddle.position.x, paddle.position.y, paddle.size.width,
      paddle.size.height);

    // draw ball
    ctx.fillStyle = 'yellow';
    ctx.fillRect(ball.position.x, ball.position.y, ball.size.width, ball.size.height);

    // draw bircks
    bricks.forEach(function (brick, index) {
      ctx.fillStyle = (index % 2 > 0) ? 'red' : 'green';
      ctx.fillRect(brick.position.x, brick.position.y, brick.size.width, brick.size.height);
    });

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

    paddle.position.y = canvas.height - 50;

    var brickSize = {
      width: canvas.width / 10,
      height: canvas.width / 10 * 3 / 4
    };

    bricks.forEach(function (brick, brickIndex) {
      brick.position = {
        x: (brickIndex % 10) * brickSize.width,
        // @wtfJS http://stackoverflow.com/questions/4228356/integer-division-in-javascript
        y: (Math.floor(brickIndex / 10)) * brickSize.height
      };


      brick.size = brickSize
    });

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

    initLevel();
    initBall(ball);
    initDraw();
    enableInGameListeners();
    requestAnimationFrame(draw);
  }

  function ballImpact(ball) {
    if (++ball.impacts > 4 && ball.speed.x < 3) {
      ball.impacts = 0;
      ball.speed.x *= 1.2;
      ball.speed.y *= 1.2;
    }
  }

  function ballLost(ball) {
    initBall(ball);
  }

  function initLevel() {
    var brickIndex;
    bricks = [];
    for (brickIndex = 0; brickIndex < 4 * 10; brickIndex++) {
      bricks.push({});
    }
    console.log(bricks);
  }

  function initBall(ball) {
    ball.position = { x: canvas.width / 3, y: 0 };
    ball.speed = { x: 1, y: 1 };
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
