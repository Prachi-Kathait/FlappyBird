//board

let board;
let boardWidth = 360; // width wrt the real width on the bg image
let boardHeight = 640; // similarly, for the height
let context;
//----------------------------------------
//bird

// sizes wrt the real image
let birdWidth = 34;
let birdHeight = 24;
//initial position in start and center -> Width - total/8 AND Height - total/2
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
//----------------------------------------
//object for bird
let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};
//-----------------------------------------

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
//-----------------------------------------
// game physics
let velocityX = -2; // pipe moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;
// gravity -> DOWN
let gameOver = false;
let score = 0;
//-----------------------------------------
window.onload = function () {
  // window.onload -> uns a function when the entire webpage (HTML, CSS, images, etc.) has finished loading.
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // used for drawing on board- shapes

  // //draw flappy bird
  // context.fillStyle = "green";
  // // fillStyle = "color" → Sets the fill color for shapes.
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);
  // // fillRect() → Draws a rectangle (basic way to show the bird).

  //load image
  birdImg = new Image(); // new Image(); → Creates a new Image object in JavaScript.
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    // drawImage() → Draws the bird at a specific position on the canvas.
    // birdImg → The image to draw.
    // bird.x, bird.y → The position where the bird appears.
    // bird.width, bird.height → The size of the bird.
  };

  topPipeImg = new Image();
  topPipeImg.src = "./topPipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottomPipe.png";

  requestAnimationFrame(update);
  // requestAnimationFrame(update) → Calls update() right before the next screen refresh.
  // Creates smooth, efficient animations (60 FPS). Automatically pauses when the tab is inactive, saving power.

  setInterval(placePipes, 1500);

  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, boardWidth, boardHeight);
  // Clears the entire canvas before drawing the new frame.

  //bird
  velocityY += gravity;
  //   bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0); // set a limit on the top
  // draw bird again and again
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  // Draws the bird at its updated position.

  if (bird.y > boardHeight) {
    gameOver = true;
  }

  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    //SCORE->
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; // 0.5 becoz there are 2 pipes-> 0.5* 2= 1  => 1 for each set of pipe
      pipe.passed = true;
    }
    //
    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); // remove first elements from the array
  }

  //SCORE
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 5, 90);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    //jump
    velocityY = -6;

    //RESET
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
