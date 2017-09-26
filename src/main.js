// BrekoutJS
// by Tangorri
//
/////////////////////

(main = () => {
  'use strict';

  let upateIntervalID;
  let gamePaused = false;
  let gameLost = false;

  const canvasMaxSize = { width: 320, height: 256 };
  const canvasRatio = Math.round(canvasMaxSize.width / canvasMaxSize.height);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let paddle = {
    size: { width: 100, height: 20 }
    , position: { x: 0, y: canvas.height - 50 }
  };

  let ball = {
    size: { width: 12, height: 12 }
    , position: { x: 0, y: 0 }
    , speed: { x: 1, y: 1 }
    , impacts: 0
  };

  let lifeLeft = 3;
  let score = 0;

  let bricks = [];

  let mouseTarget = { x: null, y: null };

  const update = () => {
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

    // ball walls hit tests and reactions.
    if (ball.position.y < 0 && ball.speed.y < 0) {
      ball.speed.y *= -1;
      ballImpact(ball);
    } else if (ball.position.y > canvas.height) {
      onBallLost(ball);
    } else if (ball.speed.y > 0 &&
      (ball.position.y + ball.size.height > paddle.position.y) &&
      (ball.position.x + ball.size.width > paddle.position.x) &&
      (ball.position.x - ball.size.width) < paddle.position.x + paddle.size.width) {
      ball.speed.y *= -1;
      ballImpact(ball);
    } else {
      // Hit Test for Ball with all Bricks.
      for (let singleBrick of bricks) {
        let brick = singleBrick;

        // Ball and Brick HitTest.
        //if (ball.speed > 0) {
        if (ball.position.x > brick.position.x &&
          ball.position.x + ball.size.width < brick.position.x + brick.size.width &&
          ball.position.y > brick.position.y &&
          ball.position.y + ball.size.height < brick.position.y + brick.size.height) {
          console.log('\n!!! --- hitting brick --- !!!\n');
          if (Math.abs(ball.speed.x) > 2 || Math.abs(ball.speed.y) > 2) {
            ball.speed.x *= -(0.5 + Math.random(9));
            ball.speed.y *= -(0.5 + Math.random(9));
          } else {
            ball.speed.x *= -(1 + Math.random(9));
            ball.speed.y *= -(1 + Math.random(9));
          }
          ballImpact(ball);
          // Remove Collided Brick.
          brick.ballCollision++;
          score += 30;
          // }
        }
      }

      bricks = bricks.filter(
        (brick) => {
          return brick.ballCollision === undefined
        }
      );
    }

    ball.position.x += ball.speed.x;
    ball.position.y += ball.speed.y;
  }

  const draw = () => {

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

    // draw bricks
    for (let brick of bricks) {
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.position.x, brick.position.y, brick.size.width, brick.size.height);
    };

    const bottomTextBaseLine = canvas.height - 8;

    // life
    ctx.fillStyle = 'yellow';
    ctx.fillText('LIFE : ', 20, bottomTextBaseLine);
    for (let lifeDrawIndex = 0; lifeDrawIndex <= lifeLeft; ++lifeDrawIndex) {
      ctx.fillRect(60 + (lifeDrawIndex * 10), bottomTextBaseLine - 10, 8, 8)
    }

    // Draw score
    ctx.fillStyle = 'yellow';
    ctx.fillText('SCORE: ' + score.toString(), canvas.width / 2, bottomTextBaseLine);

    // Game State infos.
    if (gameLost) {
      ctx.fillStyle = 'yellow'
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2)
    }

    if (gamePaused) {
      ctx.fillStyle = 'yellow';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }

    // get this methode callback when browser render page.
    requestAnimationFrame(draw);
  }

  const onWindowResize = (event) => {
    resizeCanvas(canvas, window.innerWidth, window.innerHeight);
  }

  const resizeCanvas = (canvas, width, height) => {
    initDraw();
    requestAnimationFrame(draw);
  }

  const initDraw = () => {

    canvas.width = Math.min(window.innerWidth - 200, canvasMaxSize.width);
    canvas.height = canvas.width / canvasRatio;

    paddle.size.width = canvas.width / 5;
    paddle.size.height = paddle.size.width / 8;

    paddle.position.y = canvas.height * .9;

    ball.size.height = ball.size.width = canvas.width / 50;

    const bricksPerRow = 10;
    const brickRatio = 3 / 4;

    let brickWidth = canvas.width / bricksPerRow;
    let brickHeight = brickWidth * brickRatio;

    for (let brick of bricks) {
      const brickIndex = bricks.indexOf(brick);
      brick.position = {
        x: (brickIndex % 10) * brickWidth,
        y: (Math.floor(brickIndex / 10)) * brickHeight
      };
      brick.size = { width: brickWidth, height: brickHeight };
    };

    // bricks.forEach((brick, brickIndex) {
    //   brick.position = {
    //     x: (brickIndex % 10) * brickWidth,
    //     // @wtfJS http://stackoverflow.com/questions/4228356/integer-division-in-javascript
    //     y: (Math.floor(brickIndex / 10)) * brickHeight
    //   };
    //   brick.size = { width: brickWidth, height: brickHeight };
    // });

    draw();
  }

  const appStart = () => {
    document.body.appendChild(canvas);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener(
      'keydown',
      (keyboardEvent) => {
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

  const ballImpact = (ball) => {
    if (++ball.impacts > 4 && ball.speed.x < 3) {
      ball.impacts = 0;
      ball.speed.x *= 1.2;
      ball.speed.y *= 1.2;
    }
  }

  // Ball has been lost.
  const onBallLost = (ball) => {
    lifeLeft--;
    // maybe that was the final fatal player mistake.
    if (lifeLeft < 0) onGameLost();
    else initBall(ball);
  }

  const onGameLost = () => {
    gameLost = true;
  }

  const initLevel = () => {
    var brickIndex;
    bricks = [];
    for (brickIndex = 0; brickIndex < 40; brickIndex++) {
      bricks.push({ color: (brickIndex % 2 > 0) ? 'red' : 'green' });
    }
    console.log(bricks);
  }

  const initBall = (ball) => {
    ball.position = { x: canvas.width / 3, y: 0 };
    ball.speed = { x: 1, y: 1 };
  }

  const enableInGameListeners = () => {
    window.addEventListener('mousemove', paddleUpdateOnMouseMove);
    upateIntervalID = window.setInterval(update, 1000 / 60);
  }

  const disableInGameListeners = () => {
    window.removeEventListener('mousemove', paddleUpdateOnMouseMove);
    window.clearTimeout(upateIntervalID);
  }

  const paddleUpdateOnMouseMove = (mouseEvent) => {
    mouseTarget.x = mouseEvent.clientX;
  }

  const appResume = (params) => {
    gamePaused = false;
    enableInGameListeners();
  }

  const appPause = (params) => {
    gamePaused = true;
    disableInGameListeners();
  }

  appStart();

})();
