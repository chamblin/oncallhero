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
    reset();
  },

  update: function() {
    game.physics.arcade.collide(layer, hero);
    game.physics.arcade.collide(layer, pager);
    game.physics.arcade.collide(spikes, layer);
    game.physics.arcade.collide(hero, pager, win, null, this);
    game.physics.arcade.collide(hero, spikes, lose, null, this);
    game.physics.arcade.collide(hero, enemies, lose, null, this);

    hero.body.velocity.x = 0;
    if(onReadyScreen && stop){
      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        beginLevel();
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
      updateEnemies();
    }
    scoreText.text = "score: " + score;
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