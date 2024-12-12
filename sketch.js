//Player Block
let player;

//Counts Amount of Triangles that show and then delete when distance is greater than canvas.
let trian = [];

let trianTwo =  [];

//Sprite Array Test
let spriteArray = [];

//Set's what appears first on the canvas.
let programState = 'title';

//Saves Score Variable
let score = 0;

//Shows Score
let minScore = 0;

//Font Name 
let myFont;

//TVSprite
let TvSprite;

//BreadStickSprite
let BreadSprite;

//PinkBoxSprite
let BoxSpri;

//Triangle Spike Asset
let Spike;

//Title Screen Image
let titleImage;

//Bird Gif Title Page
let smallbird;

//ScrollImage
let ScrollImage;

//Effect When Jumping
let effectJump;

//Empty Clear png image
let emptyImage;

//Flying Spike Asset
let tryFly;

//GameOver Asset
let endGame;

//Minigame Backgroundgif
let backMini;

//Star
let star;

//background Arcade
let backback;

//Music Jump
let musicJump;

//Sound when Damaged
let musicDamage;

//Game Over Sound
let gameoSound;

//Sound for block when placed.
let blockPlace;

//Makes sure sound has not been played twice.
let hasPlayed = false;

//Makes sure sound has not been played twice.
let hasPlayedTwo = false;

//Start sound
let startSound;

//Restart Sound
let restartSound;

//Background Music
let musicBack;

// ALL Minigame variables
let stackBlocks = [];
let currentBlock;
let stackerSpeed = 5;
let stackerDirection = 1;
let stackerHeight = 0;
let stackerMaxHeight = 8;
let hasPlayedStacker = false;

// Invincibility timer used for when player is resumes gameplay after minigame.
let invincibleTimer = 0;

function preload() {
  myFont = loadFont("Fonts/PixelifySans-Medium.ttf");
  TvSprite = loadImage("Sprites/TVSprite.gif");
  BreadSprite = loadImage("Sprites/BreadStickCarSprite.gif");
  BoxSpri = loadImage("Sprites/Sprite-0.gif");
  Spike = loadImage("Assets/spike.gif");
  titleImage = loadImage("Assets/TitleScreen.jpeg");
  smallbird = loadImage("Assets/smallbird.gif");
  ScrollImage = loadImage("Assets/PracticeAnimatedBG-1.gif");
  effectJump = loadImage("Sprites/PopAnimation.gif");
  emptyImage = loadImage("Sprites/Empty..png");
  tryFly = loadImage("Assets/spikeFly.gif");
  endGame = loadImage("Assets/GAMEOVER.png");
  backMini = loadImage("Sprites/Mini-GameBackground.gif");
  star = loadImage("Sprites/Star.gif");
  backback = loadImage("ArcadeCabinet-1.png");
  musicJump = loadSound("retro-jump-3-236683.mp3");
  musicDamage = loadSound("jump-climb-or-damage-sound-f-95942.mp3");
  gameoSound = loadSound("game-over-38511.mp3");
  blockPlace = loadSound("retro-blip-236676.mp3");
  startSound = loadSound("retro-coin-1-236677.mp3");
  restartSound = loadSound("coin-collect-retro-8-bit-sound-effect-145251.mp3");
  musicBack = loadSound("8-bit-retro-game-music-233964.mp3");
}

function setup() {
  //Arcade Image
  let img = createImg("ArcadeCabinet-1.png");
  img.position(1,1);
  canvas = createCanvas(800, 400);
  canvas.parent('sketch-holder');
  
  frameRate(60);
  player = new Player();
}

//Interaction with player sets program stake empty.
function keyPressed() {
  if (programState === 'empty' && key === ' ') {
    player.jump();
    musicJump.play();
  }
//Stacker mini game routes states effect of length of stack blocks.
  if (programState === 'stacker' && key === ' ') {
    blockPlace.play();
    if (currentBlock) {
      if (stackBlocks.length > 0) {
        let lastBlock = stackBlocks[stackBlocks.length - 1];
        //MATH.MAX IS SO WEIRD, LEAVING THIS NOTE TO REMEMBER TO KEEP RESEARCHING IT!!
        let overlap = Math.min(currentBlock.x + currentBlock.w, lastBlock.x + lastBlock.w) - Math.max(currentBlock.x, lastBlock.x);
        //STACKER OVERLAP INFO SO LONG
        if (overlap > 0) {
          currentBlock.w = overlap;
          currentBlock.x = Math.max(currentBlock.x, lastBlock.x);
          stackBlocks.push(currentBlock);
          stackerHeight++;
          if (stackerHeight >= stackerMaxHeight) {
            hasPlayedStacker = true;
            stackBlocks = [];
            currentBlock = null;
            stackerHeight = 0;
            //Starts the invincibility timer
            invincibleTimer = millis();
            //RESUMES GAME
            programState = 'empty';
          } else {
            //Creates new block that matches overlap size!!!!
            currentBlock = createStackerBlock(overlap); 
          }
        } else {
          //GAMEOVER
          programState = 'gameover'; 
          //Stacker height resume
        }
      } else {
        stackBlocks.push(currentBlock);
        stackerHeight++;
        if (stackerHeight >= stackerMaxHeight) {
          hasPlayedStacker = true;
          stackBlocks = [];
          currentBlock = null;
          stackerHeight = 0;
          //Invincibility timer
          invincibleTimer = millis(); 
          //Resumes MAIN GAME
          programState = 'empty'; 
        } else {
          //RETAIN FIRST BLOCK SIZE
          currentBlock = createStackerBlock(currentBlock.w); 
        }
      }
    }
  }

  if (programState === 'gameover' && key === 'r') {
    restartSound.play();
    //RESTART GAME AND INFORMATION
    programState = 'empty'; 
    score = 0;
    hasPlayedStacker = false;
    stackBlocks = [];
    currentBlock = null;
    stackerHeight = 0;
    trian = [];
    trianTwo = [];
  }
}

function draw() {
  background(200);
  
    if (!musicBack.isPlaying() && !hasPlayedTwo) {
    musicBack.play();
    hasPlayedTwo = true;
    }

  image(ScrollImage, 1, 1, 800, 400);

  switch (programState) {
    case 'title':
      title();
      break;

    case 'empty':
      runGame();
      break;

    case 'stacker':
      runStacker();
      break;

    case 'gameover':
      gameOverScreen();
      break;
  }
}

function runGame() {
  //Score variable
  score += 0.05;
  fill(0, 102, 153);
  textSize(30);
  textFont(myFont);
  text(round(score), 10, 32);
  

  player.show();
  player.move();

  if (random(1) < 0.03) {
    if (score > minScore) {
      trian.push(new Try());
      trianTwo.push(new TryFly());
      minScore = score + 2 + random(1);
    }
  }

  for (tri of trian) {
    tri.setSpeed(8 + sqrt(score) / 5);
    tri.move();
    tri.show();
//Checks if invincibilty period is over
    if (millis() - invincibleTimer > 5000) { 
      if (player.hits(tri) && !hasPlayedStacker) {
        programState = 'stacker';
        resetStacker();
        musicDamage.play();
      } else if (player.hits(tri)) {
        programState = 'gameover';
      }
    }

    if (tri.getX() < -50) {
      trian.shift();
    }
  }

  for (trifly of trianTwo) {
    trifly.setSpeed(11 + sqrt(score) / 5);
    trifly.move();
    trifly.show();
//Checks if invincibilty period is over for trifly
    if (millis() - invincibleTimer > 5000) {
      if (player.hits(trifly) && !hasPlayedStacker) {
        programState = 'stacker';
        resetStacker();
        musicDamage.play();
      } else if (player.hits(trifly)) {
        programState = 'gameover';
      }
    }

    if (trifly.getX() < -50) {
      trianTwo.shift();
    }
  }
}

//STACKER MINIGAME YIPPEE
function runStacker() {
  background(50);
  fill(255);
  image(backMini,1,1);
  image(star,width/2,height*0.15);
  textSize(30);
  text('Stacker Minigame', width / 3, 50);

  //Initial size of blocks
  for (let block of stackBlocks) {
    rect(block.x, block.y, block.w, block.h);
  }
//BLOCK speed
  if (currentBlock) {
    currentBlock.x += stackerSpeed * stackerDirection;
    if (currentBlock.x < 0 || currentBlock.x + currentBlock.w > width) {
      stackerDirection *= -1;
    }
    rect(currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h);
  } else if (stackerHeight < stackerMaxHeight) {
    currentBlock = createStackerBlock(currentBlock ? currentBlock.w : 100);
  }
}
//RESET Stacker
function resetStacker() {
  stackBlocks = [];
  currentBlock = createStackerBlock(100);
  stackerHeight = 0;
  stackerDirection = 1;
}
//CREATES stacker block, I hated coding this part :/
function createStackerBlock(width) {
  return { x: width / 2, y: height - 40 - stackerHeight * 40, w: width, h: 30 };
}
//Shows gameover screen
function gameOverScreen() {
  background(0);
  image(endGame, width / 4, height / 4);
  textSize(30);
  fill(255);
  text('Press R to Restart', width / 3, height * 0.9);
  //HighScore Show
  text('High Score:',width/3,height  * 0.8);
  text(round(score), width/2 + 40, height* 0.8);
    if (!gameoSound.isPlaying() && !hasPlayed) {
    gameoSound.play();
    hasPlayed = true;
  }
  
  
}
//Title screen
function title() {
  background(160, 10, 210);
  fill(255);
  image(titleImage, 1, 1);
  image(smallbird, 160, height / 2 - 50, 40, 40);
  textFont(myFont);
  textSize(80);
  text('Shape Runner', width / 6, height / 5);
  textSize(25);
  text('Press "Z" To Start', width / 3, height * 0.83);

  if (keyIsPressed && (key === 'z' || key === 'Z')) {
    programState = 'empty';
    startSound.play();
  }
}

class Player {
  constructor() {
    this.size = 50;
    this.x = 50;
    this.y = height - this.size;
    this.vy = 0;
    this.gravity = 1.5;
  }

  jump() {
    if (this.y === height - this.size) {
      this.vy = -23;
    }
  }

  move() {
    this.y += this.vy;
    this.vy += this.gravity;
    this.y = constrain(this.y, 0, height - this.size);
  }

  show() {
    fill(255, 102, 153);
    rect(this.x, this.y, this.size, this.size);
    image(TvSprite, this.x, this.y, this.size, this.size);

    if (keyIsPressed == ' '){
      image(emptyImage,this.x-10, this.y-10, this.size +20, this.size+20);
    }else{
      image(effectJump,this.x-20, this.y-10, this.size +40, this.size+20);
    }
  }

  hits(tri) {
    return collideLineRect(tri.x, height, tri.x + tri.size / 2, tri.y, this.x, this.y, this.size, this.size);
  }

  hits(trifly) {
    return collideLineRect(trifly.x + 12, height - 80, trifly.x + trifly.size - 70 / 2, trifly.y, this.x, this.y, this.size, this.size);
  }
}

class Try {
  constructor() {
    this.size = 50;
    this.x = width;
    this.y = height - this.size;
    this.speed = 8;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  getX() {
    return this.x;
  }

  move() {
    this.x -= this.speed;
  }

  show() {
    fill(0, 102, 153);
    triangle(this.x, height, this.x + this.size / 2, this.y, this.x + this.size, height);
    image(Spike, this.x - 5, this.y - 20, this.size + 10, this.size + 20);
  }
}

class TryFly {
  constructor() {
    this.size = 50;
    this.x = width;
    this.y = height - this.size - 60;
    this.speed = 6;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  getX() {
    return this.x + 30;
  }

  move() {
    this.x -= this.speed + 2;
  }

  show() {
    fill(0, 102, 153);
    triangle(this.x + 12, height - 80, this.x + this.size - 70 / 2, this.y, this.x + this.size - 20, height - 80);
    image(tryFly, this.x - 5, this.y - 20, this.size + 10, this.size + 20);
  }
}
