  let ctx = document.querySelector("canvas"); 
  let drawingSurface = ctx.getContext("2d");
  let music = document.getElementById("music");
  
  // Map key
  const EMPTY = 0;
  const GRASS = 1;
  const TREE = 2;
  const BOUND = 3;
  const AVATAR = 4;
  const ABDUCTIE = 5;
  const SHIP = 6;
  const WARP = 7;
  
  /////////////
  // level 1 //
  /////////////
  let gameBoard = [
    [3,3,3,3,3,3,3,3,3,3,3,3],
    [3,1,1,1,1,2,1,1,1,1,1,3],
    [3,1,2,1,1,1,1,1,2,1,1,3],
    [3,1,1,1,2,1,1,2,1,1,1,3],
    [3,1,1,2,1,2,1,1,2,1,1,3],
    [3,1,1,2,1,1,1,1,2,1,1,3],
    [3,2,1,1,2,1,1,2,1,2,1,3],
    [3,1,1,1,1,1,1,1,1,1,1,3],
    [3,3,3,3,3,3,3,3,3,3,3,3]];
    
  // level 1 objects
  let levelObjs = [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,5,0,0],
    [0,0,0,0,0,4,0,0,0,0,0,0],
    [0,0,5,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,5,0,0,0,0,0],
    [0,0,0,5,0,0,0,0,5,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]];

  /////////////
  // level 2 //
  /////////////
  let lv2 = [
    [3,3,3,3,3,3,3,3,3,3,3,3],
    [3,1,1,2,1,2,1,1,1,1,1,3],
    [3,1,2,1,1,1,2,1,2,2,1,3],
    [3,1,2,1,1,1,2,1,1,1,1,3],
    [3,1,2,1,1,1,1,2,2,1,1,3],
    [3,1,1,2,1,2,1,1,1,1,1,3],
    [3,2,1,2,1,1,2,2,1,2,1,3],
    [3,1,1,1,1,2,1,1,1,2,1,3],
    [3,3,3,3,3,3,3,3,3,3,3,3]];
    
  // level 2 objects
  let lv2Objs = [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,5,0,0,0,5,0,0,5,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,5,0,0,0,4,0,5,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,5,0,0,0,0,0,0,5,0,0],
    [0,0,0,0,5,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,5,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]];
  
  const TILESHEETCOLUMNS = 5; // total collumns on the sprite sheet.
  const SIZE = 64; // number of pixels high/wide of each game cell.
  const SPEED = 4;
  const ROWS = gameBoard.length; // number of rows on the game board.
  const COLUMNS = gameBoard[0].length; // number of columns on the game board.
  
  // game stages, used for tracking what state the game is in.
  const LOADING = 0;
  const MAP_SETUP = 1;
  const INTRO = 2;
  const LV1 = 3;
  const LV2_READY = 4;
  const LV2 = 5;
  const THEEND = 6;
  
  // Sprites 
  let avatar = null;
  let countdownClock = null;
  let levelEndText = null;
  let endingMessage = null;
  let countdownClockText = null;
  let spaceCraft = null; // Sprite for the alien space craft.
  let warp2Next = null; // Sprite for level exit.
  let gameOn = null;

  // game objects storrage.
  let sprites = [];
  let messages = [];
  let trees = [];
  let abducties = [];

  
  let gameStage = LOADING; // sets the starting game state.
  let cowsAbducted = 0; // number of cows the player has abducted.
  let isInShip = false; // tracks if the player has the "key" in this case the player is in the ship.
  let hasExited = false; // tracks if the player has reached the "exit" eg has touched the level exit.
  countdown.time = 30; // max game length in seconds.

  let spriteSheetImage = new Image(); // create new image object
  spriteSheetImage.addEventListener("load", function(){gameStage = MAP_SETUP;}, false); // once loaded call loadSpriteImage()
  spriteSheetImage.src = "../images/timeBombPanic1.png"; // sets the path to the sprite sheet image on HDD

  let RIGHT = 39;
  let right = false;
  let LEFT = 37;
  let left = false;
  let UP = 38;
  let up = false;
  let DOWN = 40;
  let down = false;
  
  function play(){ // handles level 1 startup
    document.getElementById("instructions").style.display = "none"; // hides the div game instructions
    levelEndText.visible = false; // hides the game instructions background image
    countdown.start();
    gameStage = LV1;
  }
  
  function play2(){ // handles level 1 startup
    document.getElementById("lv2screen").style.display = "none"; // hides the div level 2 ready screen
    levelEndText.visible = false; // hides the level 2 ready screen background image
    gameStage = LV2;
    levelTwoSetup();
  }
  
  function levelTwoSetup(){ // resets game variables/sprites and does setup for level 2.
    stopMusic(); // stops the game music
    isInShip = false;
    countdown.time = 25; // resets the game timeer to 23 seconds.
    warp2Next.visible = false; 
    spaceCraft.visible = false;
    cowsAbducted = 0;
    hasExited = false;
    
    avatar.sourceX = 193; // sets the source location on the sprite sheet horizontal pixels.
    avatar.sourceY = 0; // sets the source location on the sprite sheet vertical pixels.
    avatar.width = 56;  
    avatar.height = 56;
    avatar.sourceWidth = 64;
    avatar.sourceHeight = 64;
    
    for(let row = 0;row < ROWS; row++){ // sets up the game board and game objects for level 2.
      for(let col = 0; col < COLUMNS; col++){
        gameBoard[row][col] = lv2[row][col];
        levelObjs[row][col] = lv2Objs[row][col];
      }
    }
    sprites = [];
    messages = [];
    trees = [];
    abducties = [];
    //assetsToLoad = [];
    
    levelMapSetup(gameBoard); // calls the levelMapSetup() function with the new level 2 gameBoard.
    levelMapSetup(levelObjs);
    placeLevelObjects();
    countdown.start(); // starts the game countdown timer.
  }
  
  window.addEventListener("keydown", function(event){ // keyboard listener for when arrow keys are pressed
    switch(event.keyCode){
      case UP:
        up = true;
        break;
      case DOWN:
        down = true;
        break;
      case LEFT:
        left = true;
        break;
      case RIGHT:
        right = true;
        break; 
    }
  }, false);

  window.addEventListener("keyup", function(event){ // keyboard listener for when arrow keys are released
    switch(event.keyCode){
      case UP:
        up = false;
        break;
      case DOWN:
        down = false;
        break;
      case LEFT:
        left = false;
        break;  
      case RIGHT:
        right = false;
        break; 
    }
  }, false);

  animationLoop(); // calls animation loop function.

  function animationLoop(){ // animation loop function
    let sprite;
    let message
    requestAnimationFrame(animationLoop, ctx); // Application program interface for running animation in the browser.
    switch(gameStage){ 
      case LOADING:
        console.log("loading...");
        break;
      case MAP_SETUP:
        console.log("Map Setup...");
        levelMapSetup(gameBoard); // call to build the 
        levelMapSetup(levelObjs);
        placeLevelObjects();
        gameStage = INTRO;
        break;
      case INTRO:
        console.log("Displaying the game Intro...");
        levelEndText.visible = true;
        break;
      case LV1:
        console.log("Starting level 1 gameplay...");
        music.play(); // plays game music mp3 to let the player know the game has begun.
        playGame();
        break;
      case LV2_READY:
        console.log("level 2 ready screen...");
        break;
      case LV2:
        console.log("Starting level 2 gameplay...");
        music.play(); // plays game music mp3 to let the player know the game has begun.
        playGame();
        break;
      case THEEND:
        console.log("Game over...");
        flowHandler();
        break;
    }
    
    drawingSurface.clearRect(0, 0, ctx.width, ctx.height); // clears the canvas before drawing
    for(let i = 0; i < sprites.length; i++){// draws the sprites one buy one
      sprite = sprites[i];
      if(sprite.visible){
        // draws the sprite
        drawingSurface.drawImage(spriteSheetImage, sprite.sourceX, sprite.sourceY, sprite.sourceWidth, sprite.sourceHeight, sprite.x, sprite.y, sprite.width, sprite.height); 
      }
    }

    for(let i = 0; i < messages.length; i++){
      message = messages[i];
      if(message.visible){
        drawingSurface.font = message.font;  
        drawingSurface.fillStyle = message.fillStyle;
        drawingSurface.textBaseline = message.textBaseline;
        drawingSurface.fillText(message.text, message.x, message.y);  
      }
    }
  }

  function levelMapSetup(levelMap){
    let tempTile = 0;
    let spriteSheetX = 0;  
    let spriteSheetY = 0;
    for(let row = 0; row < ROWS; row++){	
      for(let column = 0; column < COLUMNS; column++){ 
        tempTile = levelMap[row][column];
        if(tempTile !== EMPTY){
          spriteSheetX = Math.floor((tempTile - 1) % TILESHEETCOLUMNS) * SIZE; // gets the X location on the sprite sheet
          spriteSheetY = Math.floor((tempTile - 1) / TILESHEETCOLUMNS) * SIZE; // gets the Y location on the sprite sheet
          switch (tempTile){
            case ABDUCTIE: // sets propertys for the cow/ABDUCTIE object
              // Changed from abducting humans to cows
              let cow = Object.create(spriteObject);
              cow.sourceX = spriteSheetX;
              cow.sourceY = spriteSheetY-13; // cow sprite is shorter verticaly than the normal 64px
              cow.x = column * SIZE;
              cow.y = (row * SIZE);
              abducties.push(cow);
              sprites.push(cow);
              break;
              
            case AVATAR:
              // this is the player eg alien
              avatar = Object.create(spriteObject);
              avatar.sourceX = spriteSheetX;
              avatar.sourceY = spriteSheetY; 
              avatar.width = SIZE-8; // alien width is less than the tile width to allow player to move on the game board more easly.
              avatar.height = SIZE-8;                   
              avatar.x = column * SIZE + 4; // column * SIZE + 4 would place the alien in the
              // upper left corner of the tile. The +4 centers the alien in the tile to start.
              avatar.y = row * SIZE + 4;
              sprites.push(avatar);
              break;
            
            case BOUND:
              let bound = Object.create(spriteObject);
              bound.sourceX = spriteSheetX;
              bound.sourceY = spriteSheetY;
              bound.x = column * SIZE;
              bound.y = row * SIZE;
              sprites.push(bound);
              break;
            
            case GRASS:
              let grass = Object.create(spriteObject);
              grass.sourceX = spriteSheetX;
              grass.sourceY = spriteSheetY;
              grass.x = column * SIZE;
              grass.y = row * SIZE;
              sprites.push(grass);
              break;
            
            case TREE:
              let tree = Object.create(spriteObject);
              tree.sourceX = spriteSheetX;
              tree.sourceY = spriteSheetY;
              tree.x = column * SIZE;
              tree.y = row * SIZE;
              sprites.push(tree);
              trees.push(tree);
              break;
            
          }
        }
      }
    }
  }
 
  function playMoo(){ // plays cow capture audio mp3... Moo!
    let mooSound = document.getElementById("moo");
    mooSound.play(); 
  }
  function playMotherShip(){ // plays win game audio mp3.
    let motherShipSound = document.getElementById("motherShip");
    motherShipSound.play(); 
  }
  function playWarp(){
    let warpHomeSound = document.getElementById("warpSound");
    warpHomeSound.play(); 
  }
  function stopMusic(){ // stops the game music.
    music.pause();
    music.currentTime = 0;        
  }
  
  function placeLevelObjects(){ //
    spaceCraft = Object.create(spriteObject); // creates the sprite object for the spacecraft
    spaceCraft.sourceX = 257; // sets the source location on the sprite sheet horizontal pixels
    spaceCraft.sourceY = 65; // sets the source location on the sprite sheet vertical pixels
    spaceCraft.sourceWidth = SIZE;
    spaceCraft.sourceHeight = 46;
    spaceCraft.width = 56;  
    spaceCraft.height = 38;
    spaceCraft.visible = false; // hides the spacecraft 
    sprites.push(spaceCraft); // places the spacecraft into the sprites array
    
    countdownClock = Object.create(spriteObject);
    countdownClock.sourceX = 0;
    countdownClock.sourceY = SIZE;
    countdownClock.sourceWidth = 128;
    countdownClock.sourceHeight = 48;
    countdownClock.width = 128;  
    countdownClock.height = 48;            
    countdownClock.x = ctx.width / 2 - countdownClock.width / 2;
    countdownClock.y = 8;
    sprites.push(countdownClock);
    
    countdownClockText = Object.create(messageObject);
    countdownClockText.x = 360;
    countdownClockText.y = 14;
    countdownClockText.font = "bold 40px Helvetica";
    countdownClockText.fillStyle = "white";
    countdownClockText.text = "";
    countdownClockText.visible = true;
    messages.push(countdownClockText);
    
    warp2Next = Object.create(spriteObject);
    warp2Next.sourceX = 128;
    warp2Next.sourceY = 65;
    warp2Next.width = SIZE+2; // set 2 pixels larger than normal(64) so player can bump into tile and trigger the next level.
    warp2Next.height = SIZE+2; // set 2 pixels larger than normal(64) so player can bump into tile.
    warp2Next.visible = false;
    sprites.push(warp2Next);
    
    levelEndText = Object.create(spriteObject);
    levelEndText.sourceX = 0;
    levelEndText.sourceY = 129;
    levelEndText.sourceWidth = 320;
    levelEndText.sourceHeight = 240;
    levelEndText.width = 770;  
    levelEndText.height = 576;            
    levelEndText.x = ctx.width / 2 - levelEndText.width / 2;
    levelEndText.y = ctx.height / 2 - levelEndText.height / 2;
    levelEndText.visible = false;
    sprites.push(levelEndText);
    
    gameOn = Object.create(spriteObject); // 
    gameOn.sourceX = 0;
    gameOn.sourceY = 369;
    gameOn.sourceWidth = 320;
    gameOn.sourceHeight = 290;
    gameOn.width = 770;
    gameOn.height = 576;
    gameOn.x = 0;
    gameOn.y = 0;
    gameOn.visible = false;
    sprites.push(gameOn);
    
    endingMessage = Object.create(messageObject);
    endingMessage.x = 125;
    endingMessage.y = 310;
    endingMessage.font = "bold 30px Helvetica";
    endingMessage.fillStyle = "white";
    endingMessage.text = "";
    endingMessage.visible = false;
    messages.push(endingMessage);
    
    gameLost = Object.create(spriteObject); // 
    gameLost.sourceX = 0;
    gameLost.sourceY = 659;
    gameLost.sourceWidth = 320;
    gameLost.sourceHeight = 240;
    gameLost.width = 770;
    gameLost.height = 576;
    gameLost.x = 0;
    gameLost.y = 0;
    gameLost.visible = false;
    sprites.push(gameLost);
  }
  
  function playGame(){ 
    let cow;
    if(up){ // move Up.
      avatar.yVelocity = -SPEED;
    }
    if(down){ // move Down.
      avatar.yVelocity = SPEED;
    }
    if(left){ // move Left.
      avatar.xVelocity = -SPEED;
    }
    if(right){ // move Right .
      avatar.xVelocity = SPEED;
    }

    if(!up && !down){ // Sets the avatar's velocity to zero if arrow keys aren't being pressed
      avatar.yVelocity = 0;
    }
    if(!left && !right){ // Sets the avatar's velocity to zero if arrow keys aren't being pressed
      avatar.xVelocity = 0;
    }
    avatar.x += avatar.xVelocity;
    avatar.y += avatar.yVelocity;
    // bounds checking
    if(avatar.x < SIZE){ // left bound
      avatar.x = SIZE;
    }
    if((avatar.x + avatar.width) > (ctx.width - SIZE)){ // right bound
      avatar.x = ctx.width - avatar.width - SIZE;
    }
    if(avatar.y < SIZE){ // top bound
      avatar.y = SIZE;
    }
    if((avatar.y + avatar.height) > (ctx.height - SIZE)){ // bottom bound
      avatar.y = ctx.height - avatar.height - SIZE;
    }
    
    // Collisions with trees
    for(let i = 0; i < trees.length; i++){
      blockRectangle(avatar, trees[i]);
    }
    // Collisions with abducties (cows)
    for(let i = 0; i < abducties.length; i++){
      cow = abducties[i];
      if(hitTestCircle(avatar, cow) && cow.visible){
        cowsAbducted = (cowsAbducted + 1);
        if(cowsAbducted === abducties.length){
          playMotherShip(); // plays ufo spaceship audio.
          placeObj(SHIP); // places the spaceship on the game map
          placeObj(WARP); // places the alien planet(level exit) on the game map boarder.
        }
        playMoo(); // plays the cow beam Up audio mp3
        cow.visible = false;
      }
    }
    // Collisions with space craft
    if(hitTestRectangle(avatar, spaceCraft) && spaceCraft.visible){
      avatar.sourceX = 193; // sets the source location on the sprite sheet horizontal pixels
      avatar.sourceY = 65; // sets the source location on the sprite sheet vertical pixels
      avatar.sourceWidth = 64;
      avatar.sourceHeight = 46;
      avatar.width = 56;  
      avatar.height = 38;
      spaceCraft.visible = false; // hides the spacecraft
      isInShip = true;          
    }
    // countdown timer
    countdownClockText.text = countdown.time; // display the countdown.
    if(countdown.time < 10){ // makes the time show a zero infront of the las 9 seconds of the game.
      countdownClockText.text = " " + countdown.time;
    }
    if(countdown.time <= 0){ // if out of time end the level and set gameStage to over.
      gameStage = THEEND;
    }
    // Level exit collision detction
    if(hitTestRectangle(avatar, warp2Next) && warp2Next.visible && isInShip){
      playWarp();
      hasExited = true;
      flowHandler();
    }
  }
  
  function flowHandler(){ //
    stopMusic();
    countdown.stop();
    if(gameStage === INTRO){
      gameStage = LV1;
    }else if(gameStage === LV1){
      countdownClockText.visible = false; // hides the counnt down clock.
      gameStage = LV2_READY; // sets the game state to the next level (LV2_READY<-LV2)
      //levelTwoSetup();
      document.getElementById("lv2screen").style.display = "block"; // hides the div level 2 ready screen
      gameOn.visible = true; // makes the game win screen image visible.
    }else if(gameStage === LV2){
      gameStage = THEEND; // sets the game state to end the game.
    }else if(gameStage === THEEND){
      countdownClockText.visible = false; 
      if(cowsAbducted === abducties.length && hasExited){
        gameOn.visible = true; // makes the game win screen image visible.
        endingMessage.visible = true; // makes the game message visible.
        endingMessage.text = "You Win! You abducted enought cows";
      }else{
        gameLost.visible = true;
        endingMessage.visible = true;
        endingMessage.text = "You Lose! UFO spotted in the woods";
      }
    }
  }
  
  function placeObj(item){ //
    let randRow; 
    let randCol; 
    if(item == SHIP){ // places the space ship (eg the key) to exit the level
      randRow = Math.floor((Math.random() * 7) + 1); 
      randCol = Math.floor((Math.random() * 10) + 1);
      while(gameBoard[randRow][randCol] != 1 || levelObjs[randRow][randCol] == 4){ // if the location is bad find another
        randRow = Math.floor((Math.random() * 7) + 1); 
        randCol = Math.floor((Math.random() * 10) + 1);
      }
      levelObjs[randRow][randCol] = SHIP; // place the ship in the levelObjs aray
      spaceCraft.x = (randCol * SIZE) + 4; 
      spaceCraft.y = (randRow * SIZE) + 13;
      spaceCraft.visible = true;
      
    }else if(item == WARP){ // places the exit to next level where the player can get to it along the perimeter of the gameboard.
      randRow = Math.floor(Math.random() * 9); // generates a number 0-9
      if(randRow === 0){
        randCol = Math.floor((Math.random() * 10) + 1); // generates a number 1-10
        while((randCol == 5 || randCol == 6) || gameBoard[randRow+1][randCol] == 2){ // columns 5 & 6 are where the game timer is this prevents the exit from being placed there.
          randCol = Math.floor((Math.random() * 10) + 1);
        }
      }else if(randRow == 8){
        randCol = Math.floor((Math.random() * 10) + 1);
        while(gameBoard[randRow-1][randCol] == 2){ // prevents placing the exit behind a tree.
          randCol = Math.floor((Math.random() * 10) + 1);
        }
      }else{
        randCol = Math.floor(Math.random() * 2);
        if(randCol == 1){
          randCol = 11;
          while(gameBoard[randRow][randCol-1] == 2){ // prevents placing the exit behind a tree.
            randRow = Math.floor((Math.random() * 7) + 1);
          }
        }else if(randCol === 0){
          while(gameBoard[randRow][randCol+1] == 2){ // prevents placing the exit behind a tree.
            randRow = Math.floor((Math.random() * 7) + 1);
          }
        }
      }
      levelObjs[randRow][randCol] = WARP; // places the level exit marker along the perimeter of the gameboard.
      warp2Next.x = (randCol * SIZE)-1;
      warp2Next.y = (randRow * SIZE)-1;
      warp2Next.visible = true;
    }
  }
  
  document.getElementById("btn").addEventListener("click", function(){play();});
  document.getElementById("btn2").addEventListener("click", function(){play2();});
  