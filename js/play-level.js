var PlayLevel = function(game) {  };

PlayLevel.prototype = {
  preload: function() {
    game.stage.backgroundColor = "#7ec0ee";
    for(var i = 0; i < levels.length; i++){
      game.load.tilemap("level" + i, levels[i], null, Phaser.Tilemap.TILED_JSON);
    }
    game.load.image("ground_1x1", "assets/Ground.png");
    game.load.spritesheet("hero", "assets/Hero.png", 32, 32);
    game.load.image("spike", "assets/Spike.png");
    game.load.image("spike_u", "assets/SpikeUpsideDown.png");
    game.load.image("enemy", "assets/Enemy.png");
    game.load.spritesheet("pager", "assets/Pager.png", 32, 32);
    game.load.audio("jump", "assets/jump.ogg");
    game.load.audio("win", "assets/win.ogg");
    game.load.audio("lose", "assets/die.ogg");
  },

  create: function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // configure hero
    hero = game.add.sprite(-1000, -1000, "hero");
    game.physics.enable(hero);
    hero.body.bounce.y = 0.05;
    hero.body.collideWorldBounds = true;
    hero.body.setSize(16, 24, 8, 8);
    hero.animations.add('left', [0,1], 5, true);
    hero.animations.add('right', [3,4], 5, true);

    // configure pager
    pager = game.add.sprite(1000, 1000, "pager");
    game.physics.enable(pager);
    pager.body.allowGravity = false;
    pager.body.immovable = true;
    pager.animations.add('paging', [0,1,2], 10, true);
    pager.animations.play('paging');

    // set up sfx
    jumpSound = game.add.audio("jump");
    winSound = game.add.audio("win");
    loseSound = game.add.audio("lose");

    game.physics.arcade.gravity.y = 300;
    cursors = game.input.keyboard.createCursorKeys();
    remainingText = game.add.text(16, 16, 'remaining: 0', { font: '32px arial', fill: '#313131'});
    scoreText = game.add.text(16, 48, 'score: 0', { font: '12px arial', fill: '#313131'});
    this.reset();
  },

  update: function() {
    game.physics.arcade.collide(layer, hero);
    game.physics.arcade.collide(layer, pager);
    game.physics.arcade.collide(spikes, layer);
    game.physics.arcade.collide(hero, pager, this.win, null, this);
    game.physics.arcade.collide(hero, spikes, this.lose, null, this);
    game.physics.arcade.collide(hero, enemies, this.lose, null, this);

    hero.body.velocity.x = 0;
    if(onReadyScreen && stop){
      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        this.beginLevel();
      }
    }
    else if(!stop){
      if (cursors.left.isDown){
        hero.body.velocity.x = -150;
        hero.animations.play("left");
      }
      else if (cursors.right.isDown){
        hero.body.velocity.x = 150;
        hero.animations.play("right");
      }
      else{
        hero.animations.stop();
        hero.frame = 2;
      }
      if((cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) && hero.body.onFloor()){
        jumpSound.play();
        hero.body.velocity.y = -250;
      }

      var millisSince = game.time.elapsedSince(levelBegin);
      pointsRemaining = Math.floor(possiblePoints * (((seconds * 1000) - millisSince)/(seconds * 1000)));
      if(pointsRemaining <= 0){
        lose();
      }
      remainingText.text = "remaining: " + ((pointsRemaining > 0) ? pointsRemaining : 0);
    }
    if(enemies){
      this.updateEnemies();
    }
    scoreText.text = "score: " + score;
  },

  reset: function() {
    if(gameOverBitmap){
      gameOverBitmap.destroy();
      gameOverText.destroy();
      gameOverScore.destroy();
    }
    isGameOver = false;
    hero.revive();
    currentLevel = 0;
    score = 0;
    scoreText.text = "score: 0";
    this.loadLevel("level0");
  },

  updateEnemies: function(){
    game.physics.arcade.collide(layer, enemies, function(enemy, layer){
     enemy.body.velocityFactor = -enemy.body.velocityFactor;
     enemy.body.velocity.y = enemy.body.velocityFactor * enemySpeed;
    });
  },

  win: function(){
    winSound.play();
    score += pointsRemaining;
    scoreText.content = "score: " + score;
    pager.kill();

    currentLevel += 1;
    if(currentLevel >= levels.length){
      this.gameOver();
    }
    else{
      this.loadLevel("level" + currentLevel);
    }
  },

  lose: function(){
    loseSound.play();
    hero.kill();
    this.gameOver();
  },

  gameOver: function(){
    game.state.start("gameOver");
  },

  beginLevel: function(){
    readyScreenHelpText.destroy();
    readyScreenLevelName.destroy();
    readyScreenBitmap.destroy();
    stop = false;
    onReadyScreen = false;
    levelBegin = game.time.now;
  },

  readyScreen: function(){
    stop = true;
    onReadyScreen = true;
    readyScreenBitmap = game.add.graphics(0, 0);
    readyScreenBitmap.beginFill(0);
    readyScreenBitmap.drawRect(0, 0, 900, 800);
    readyScreenLevelName = game.add.text(16, 16, 'Level ' + (currentLevel + 1), { font: '32px arial', fill: '#FFFFFF'});
    var text = map.properties.text || "";
    readyScreenHelpText = game.add.text(16, 64, text + "\n\nPress Space to Begin", {font: '12px arial', fill: '#FFFFFF'});
  },

  loadLevel: function(resourceName){
    map = game.add.tilemap(resourceName);
    map.addTilesetImage('Ground', 'ground_1x1');
    if(layer){ layer.destroy(); }
    layer = map.createLayer("Ground");
    //layer.debug = true
    map.setCollisionByExclusion([], true, layer);

    // find hero/pager
    var heroX = map.objects.Hero[0].x;
    var heroY = map.objects.Hero[0].y;

    var pagerX = map.objects.Pager[0].x;
    var pagerY = map.objects.Pager[0].y;

    // position hero
    hero.x = heroX;
    hero.y = heroY - hero.height;

    // position pager
    pager.revive();
    pager.x = pagerX
    pager.y = pagerY - pager.height;

    // kill spikes and enemies before setting up level
    if(spikes){ spikes.destroy(); }
    if(enemies){ enemies.destroy(); }

    if(map.objects.Spikes){
      spikes = game.add.group();
      spikes.enableBody = true;
      map.createFromObjects('Spikes', 10, 'spike', 0, true, true, spikes);
      map.createFromObjects('Spikes', 11, 'spike_u', 0, true, true, spikes);
      spikes.setAll("body.allowGravity", false);
      spikes.setAll("body.immovable", true);
      spikes.forEach(function(spike){
        var isUpsideDown = (spike.key == "spike_u");
        if(isUpsideDown){
          spike.body.setSize(17, 28, 8, 0);
        }
        else{
          spike.body.setSize(17, 28, 8, 4);
        }

      }, this);

      if(map.objects.Enemies){
        enemies = game.add.group();
        enemies.enableBody = true;
        map.createFromObjects('Enemies', 12, 'enemy', 0, true, true, enemies);
        enemies.setAll("body.allowGravity", false);
        enemies.setAll("body.immovable", true);
        enemies.setAll("body.velocity.y", enemySpeed);
        enemies.forEach(function(enemy){
          enemy.body.velocityFactor = 1.0; // we'll invert this when we change directions
          enemy.body.setSize(8, 8, 12, 12);
        });
        game.physics.enable(enemies);
      }
    }
    // level parameters
    possiblePoints = parseInt(map.properties.possiblePoints);
    seconds = parseInt(map.properties.seconds);
    pointsRemaining = possiblePoints;

    this.readyScreen();
  },

  render: function() {
    //COLLISION DETECTION DEBUGGIN
    /*
    game.debug.body(hero);
    spikes.forEach(function(spike){
      game.debug.body(spike);
    }, this);
    enemies.forEach(function(enemy){
      game.debug.body(enemy);
    }, this);
    */
  }
}