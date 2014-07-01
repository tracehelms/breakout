(function($){
  $.fn.draw = function() {

    // ====================================================== INSTANCE VARIABLES
    var ctx;
    var WIDTH;
    var HEIGHT;
    var ballX;
    var ballY;
    var ballRadius;
    var ballVelocityX;
    var ballVelocityY;
    var paddleX;
    var paddleY;
    var paddleWidth;
    var paddleHeight;
    var paddleSensitivity;
    var leftDown = false;
    var rightDown = false;
    var intervalID = 0;

    // Object Sizes (Percents)
    var ballRadiusPercent = 0.03;
    var ballVelocityXPercent = 0.01;
    var ballVelocityYPercent = 0.02;
    var ballStartingPositionPercent = 0.1;
    var paddleWidthPercent = 0.2;
    var paddleHeightPercent = 0.02;
    var paddleSensitivityPercent = 0.02;

    // ================================================ INITIALIZATION FUNCTIONS
    init();
    initSizes();
    initPaddle();

    function init() {
      ctx = $('#canvas')[0].getContext("2d");
      var tmpWidth = $("body").width();
      var tmpHeight = $("body").height();
      if (tmpWidth >= tmpHeight) {
        WIDTH = tmpHeight;
        HEIGHT = tmpHeight;
      } else {
        WIDTH = tmpWidth;
        HEIGHT = tmpWidth;
      }
      ctx.canvas.width = WIDTH;
      ctx.canvas.height = HEIGHT;
      intervalID = setInterval(draw, 17); // Calls draw every 17ms (60fps) *****
      return intervalID;
    }

    function initSizes() {
      ballRadius =        WIDTH * ballRadiusPercent;
      ballVelocityX =     WIDTH * ballVelocityXPercent;
      ballVelocityY =     WIDTH * ballVelocityYPercent;
      ballX =             ballRadius + (WIDTH * ballStartingPositionPercent);
      ballY =             ballRadius + (WIDTH * ballStartingPositionPercent);
      paddleWidth =       WIDTH * paddleWidthPercent;
      paddleHeight =      WIDTH * paddleHeightPercent;
      paddleSensitivity = WIDTH * paddleSensitivityPercent;
    }

    function initPaddle() {
      paddleHeight = HEIGHT * 0.02 ; // 2% of screen
      paddleWidth = WIDTH * .20; // 20% of screen
      paddleX = (WIDTH - paddleWidth) / 2; // center of width
      paddleY = HEIGHT - (HEIGHT * 0.05); // set above bottom of screen
      paddleSensitivity = WIDTH * paddleSensitivityPercent;
    }

    // ======================================================= LIBRARY FUNCTIONS
    function circle(x, y, r) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
    }

    function rect(x, y, w, h) {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.closePath();
      ctx.fill();
    }

    function clear() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    // ====================================================== KEYBOARD INTERFACE
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    function onKeyDown(event) {
      if (event.keyCode == 37) leftDown = true;
      else if (event.keyCode == 39) rightDown = true;
    }

    function onKeyUp(event) {
      if (event.keyCode == 37) leftDown = false;
      else if (event.keyCode == 39) rightDown = false;
    }

    // ===================================================== MAIN GAMEPLAY CYCLE
    function draw() {
      clear();
      moveBall();
      movePaddle();
      checkPaddleCollision();
      checkWallCollision();
    }

    // =============================================================== ANIMATION
    function moveBall() {
      circle(ballX, ballY, ballRadius);
      ballX += ballVelocityX;
      ballY += ballVelocityY;
    }

    function movePaddle() {
      rect(paddleX, paddleY, paddleWidth, paddleHeight);
      if (leftDown) {
        if (paddleX >= 0) {
          paddleX -= paddleSensitivity;
        }
      }
      if (rightDown) {
        if ((paddleX + paddleWidth) <= WIDTH) {
          paddleX += paddleSensitivity;
        }
      }
    }

    // ===================================================== COLLISION DETECTION
    function checkPaddleCollision() {
      if (((ballY + ballRadius) > paddleY)
        && (ballX > paddleX)
        && ((ballX + ballRadius) < (paddleX + paddleWidth))) {
          ballVelocityY = -ballVelocityY;
      }
    }

    function checkWallCollision() {
      if ((ballX + ballRadius) /*+ ballVelocityX*/ > WIDTH) {
        ballVelocityX = -ballVelocityX;
        //ballX = WIDTH - (((ballX + ballRadius) - WIDTH) + ballRadius);
      }
      if ((ballX - ballRadius) /*+ ballVelocityX*/ < 0) {
        ballVelocityX = -ballVelocityX;
        //ballX -= (ballX - ballRadius);
      }
      if (ballY /*+ ballVelocityY*/ > HEIGHT) {
        clear();
        movePaddle();
        clearInterval(intervalID);

        /*ballVelocityY = -ballVelocityY;
        //ballY = HEIGHT - (((ballY + ballRadius) - HEIGHT) + ballRadius);*/
      }
      if ((ballY - ballRadius) /*+ ballVelocityY*/ < 0) {
        ballVelocityY = -ballVelocityY;
        //ballY -= (ballY - ballRadius);
      }
    }
  };
})(jQuery);
