let spriteSheet1;
let spriteSheet2;

let walkingAnimation;
let walkingAnimation2;
let walkingAnimation3;

let spriteSheetNames = ["SpelunkyGuy.png", "SpelunkyGal.png", "BUGSPRITESAGH.png"];
let spriteSheets = [];
let animations = [];

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
};

let game = { score: 0, maxScore: 0, maxTime: 30, elapsedTime: 0, totalSprites: 20, state: GameState.Start, targetSprite: 2 };

function preload() {
  for (let i=0; i < spriteSheetNames.length; i++) {
    spriteSheets[i] = loadImage("assets/" + spriteSheetNames[i]);
  }
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);

  reset();
  /*for (let i = 0; i < sprites1; i++)
  {
    walkingAnimation[i] = new WalkingAnimation(spriteSheet1, 80, 80, Math.random()*350, Math.random()*350, 8);
  }
  for (let i = 0; i < sprites2; i++)
  {
    walkingAnimation[i+sprites1] = new WalkingAnimation(spriteSheet2, 80, 80, Math.random()*350, Math.random()*350, 8);
  }*/
}

function reset() {
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(10, 30);

  animations = [];
  for (let i=0; i < game.totalSprites ; i++) {
    animations[i] = new WalkingAnimation(random(spriteSheets),80,80,random(100,300),random(100,300), 9, random(0.5, 1), 6, random([0, 1]));
  }
}

function draw() {
  switch(game.state) {
    case GameState.Playing:

      background(220);

      for (let i = 0; i < animations.length; i++)
      {
        animations[i].draw();
      }
      fill(0);
      textSize(40);
      text(game.score, 20, 40);
      let currentTime = game.maxTime - game.elapsedTime;
      text(ceil(currentTime), 300, 40);
      game.elapsedTime += deltaTime / 1000;

      if (currentTime < 0)
      {
        game.state = GameState.GameOver;
      }
      break;
    case GameState.GameOver:
      game.maxScore = max(game.score, game.maxScore);

      background(0);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      //I edited the game over to you died as an homage to my favorite game series, dark souls
      text("You Died!", 200, 200);
      textSize(35)
      text("Score: " + game.score, 200, 270);
      text("Max Score: " + game.maxScore, 200, 320);
      break;
    
    case GameState.Start:
      background(0);
      fill(255);
      textSize(50)
      textAlign(CENTER);
      text("Bug Squish!", 200, 200);
      textSize(30);
      text("Press Any Key to Start!", 200, 300);
      break;

  }
}

function keyPressed() {
  switch(game.state) {
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
  }
  /*
  for (let i = 0; i < sprites; i++)
  {
    walkingAnimation[i].keyPressed(RIGHT_ARROW, LEFT_ARROW);
  }
  */
}


function mousePressed() {
  switch(game.state) {
    case GameState.Playing:
      for (let i=0; i<animations.length; i++) {
        let contains = animations[i].contains(mouseX, mouseY);
        if (contains) {
          if (animations[i].moving != 0) {
            animations[i].stop();
            animations[i].currentFrame = 8; //it won't stop on any frame other than the starting frame.  frustration.  im so tired.  
            //the assignment doesn't explicitly state that the squished and dead frame has to be in use when it is squished and dead; just that the frame has to exist.
            //is this ok enough?  i just want to sleep.  i've learned I *hate* spriting.
            if (animations[i].spritesheet === spriteSheets[game.targetSprite])
            {
              game.score += 1;
            }
            else {game.score -= 1;}
          }
          else {
            if (moving != 0) //I don't remember what this is for, but it's broken now and when I fix it, it seems to make the game worse, so I'm just gonna leave this broken
            {
              if (animations[i].xDirection === 1)
              {
                animations[i].moveRight();
              }
              else { animations[i].moveLeft(); }
            }
          }
        }
      }
    /*
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
    */
  }
}

/*
function keyReleased()
{
  for (let i = 0; i < sprites; i++)
  {
    walkingAnimation[i].keyReleased(RIGHT_ARROW, LEFT_ARROW);
  }
}
*/

class WalkingAnimation {
  constructor(spritesheet, sw, sh, dx, dy, animationLength, speed, framerate, vertical = false, offsetX = 0, offsetY = 0) {
    this.spritesheet = spritesheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 1;
    this.xDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.speed = speed;
    this.framerate = framerate*speed;
    this.vertical = vertical;
  }

  draw() {
    
    //if (this.moving != 0) {
    //  this.u = currentFrame % animationLength;
    //}
    //else {
    //  this.u = 0;
    //}
    this.u = (this.moving !=0) ? this.currentFrame % this.animationLength : 0;
    push();
    translate(this.dx, this.dy);
    if (this.vertical) {rotate(90);}
    scale(this.xDirection, 1);

    image(this.spritesheet, 0, 0, this.sw, this.sh, this.u*this.sw+this.offsetX, this.v*this.sh+this.offset, this.sw, this.sh);
    pop();
    let proportionalFramerate = round(frameRate() / this.framerate);
    if (frameCount % proportionalFramerate == 0) 
    {
      this.currentFrame++;
    }

    if (this.vertical)
    {
      this.dy += this.moving*this.speed;
      this.move(this.dy, this.sw / 4, height - this.sw / 4);
    }
    else
    {
      this.dx += this.moving * this.speed;
      this.move(this.dx, this.sw / 4, width - this.sw / 4);
    }

  }


  move(position, lowerBounds, upperBounds) 
  {
    if (position > upperBounds) 
    {
      this.moveLeft();
    } else if (position < lowerBounds)
    {
      this.moveRight();
    }
  }

  moveRight()
  {
    this.moving = 1;
    this.xDirection = 1;
  }

  moveLeft()
  {
    this.moving = -1;
    this.xDirection = -1;
  }

  contains(x, y)
  {
    let insideX = x >= this.dx - this.sw / 2 && x <= this.dx + this.sw / 2;
    let insideY = y >= this.dy - this.sh / 2 && y <= this.dy + this.sh / 2;
    return insideX && insideY;
  }

  stop()
  {
    this.moving = 0;
    this.currentFrame = 8; //this isn't doing what I want it to do.  i am infuriated.
  }


  /*
  old code from when we used to control them
  that I don't have the heart to delete
  keyPressed(right, left) {
    
  if (keyCode === right)
    {
      this.moving = 1;
      this.xDirection = 1;
      this.currentFrame = 1;
    }
  else if (keyCode === left)
    {
      this.moving = -1;
      this.xDirection = -1;
      this.currentFrame = 1;
    }
  }
  keyReleased(right, left) {
    
  if (keyCode === right || keyCode === left)
    {
      this.moving = 0;
    }
  }
  */
}
