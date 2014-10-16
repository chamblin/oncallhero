var PlayLevel = function(game) {

  // stage
  var map;
  var layer;
  var cursors;
  var winSound;
  var loseSound;

  // sprites
  var hero;
  var pager;
  var spikes;
  var enemies;
  var scoreText;
  var remainingText;

  // level
  var seconds;
  var possiblePoints;
  var pointsRemaining;
  var levelBegin;
};

PlayLevel.prototype = {

  preload: function() {
    this.hero = new Hero(game);
  },

  create: function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // configure hero
    this.hero.create();

    // configure pager
    this.pager = game.add.sprite(1000, 1000, "pager");
    game.physics.enable(this.pager);
    this.pager.body.allowGravity = false;
    this.pager.body.immovable = true;
    this.pager.animations.add('paging', [0,1,2], 10, true);
    this.pager.animations.play('paging');

    // set up sfx
    this.winSound = game.add.audio("win");
    this.loseSound = game.add.audio("lose");

    game.physics.arcade.gravity.y = 300;
    this.cursors = game.input.keyboard.createCursorKeys();
    this.remainingText = game.add.text(16, 16, 'remaining: 0', { font: '32px arial', fill: '#313131'});
    this.scoreText = game.add.text(16, 48, 'score: 0', { font: '12px arial', fill: '#313131'});
    this.loadLevel("level" + currentLevel);
  },

  update: function() {
    if(!this.levelBegin){
      console.log("Level beginning");
      this.levelBegin = game.time.now;
    }
    this.hero.collideWith(this.layer);
    this.hero.collideWith(this.pager, this.win, null, this);
    this.hero.collideWith(this.spikes, this.lose, null, this);
    this.hero.collideWith(this.enemies, this.lose, null, this);
    game.physics.arcade.collide(this.layer, this.pager);
    game.physics.arcade.collide(this.spikes, this.layer);

    this.hero.stop();
    this.hero.move(this.cursors);

    var millisSince = game.time.elapsedSince(this.levelBegin);
    this.pointsRemaining = Math.floor(this.possiblePoints * (((this.seconds * 1000) - millisSince)/(this.seconds * 1000)));
    if(this.pointsRemaining <= 0){
      this.lose();
    }
    this.remainingText.text = "remaining: " + ((this.pointsRemaining > 0) ? this.pointsRemaining : 0);
    if(this.enemies){
      this.updateEnemies();
    }
    this.scoreText.text = "score: " + score;
  },

  updateEnemies: function(){
    game.physics.arcade.collide(this.layer, this.enemies, function(enemy, layer){
     enemy.body.velocityFactor = -enemy.body.velocityFactor;
     enemy.body.velocity.y = enemy.body.velocityFactor * ENEMY_SPEED;
    });
  },

  win: function(){
    this.winSound.play();
    score += this.pointsRemaining;
    this.scoreText.content = "score: " + score;
    this.pager.kill();

    currentLevel += 1;
    if(currentLevel >= levels.length){
      this.gameOver();
    }
    else{
      game.state.start("readyScreen");
    }
  },

  lose: function(){
    this.loseSound.play();
    this.hero.die();
    this.gameOver();
  },

  gameOver: function(){
    game.state.start("gameOver");
  },

  loadLevel: function(resourceName){
    this.map = game.add.tilemap(resourceName);
    this.map.addTilesetImage('Ground', 'ground_1x1');
    this.layer = this.map.createLayer("Ground");
    //this.layer.debug = true
    this.map.setCollisionByExclusion([], true, this.layer);

    // position hero
    this.hero.place(this.map.objects.Hero[0]);

    // position pager
    var pagerX = this.map.objects.Pager[0].x;
    var pagerY = this.map.objects.Pager[0].y;
    this.pager.x = pagerX
    this.pager.y = pagerY - this.pager.height;

    // kill spikes and enemies before setting up level
    if(this.spikes){ this.spikes.destroy(); }
    if(this.enemies){ this.enemies.destroy(); }

    if(this.map.objects.Spikes){
      this.spikes = game.add.group();
      this.spikes.enableBody = true;
      this.map.createFromObjects('Spikes', 10, 'spike', 0, true, true, this.spikes);
      this.map.createFromObjects('Spikes', 11, 'spike_u', 0, true, true, this.spikes);
      this.spikes.setAll("body.allowGravity", false);
      this.spikes.setAll("body.immovable", true);
      this.spikes.forEach(function(spike){
        var isUpsideDown = (spike.key == "spike_u");
        if(isUpsideDown){
          spike.body.setSize(17, 28, 8, 0);
        }
        else{
          spike.body.setSize(17, 28, 8, 4);
        }

      }, this);

      if(this.map.objects.Enemies){
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.map.createFromObjects('Enemies', 12, 'enemy', 0, true, true, this.enemies);
        this.enemies.setAll("body.allowGravity", false);
        this.enemies.setAll("body.immovable", true);
        this.enemies.setAll("body.velocity.y", ENEMY_SPEED);
        this.enemies.forEach(function(enemy){
          enemy.body.velocityFactor = 1.0; // we'll invert this when we change directions
          //console.log(enemy.body.velocity);
          enemy.body.setSize(8, 8, 12, 12);
        });
        game.physics.enable(this.enemies);
      }
    }
    // level parameters
    this.possiblePoints = parseInt(this.map.properties.possiblePoints);
    this.seconds = parseInt(this.map.properties.seconds);
    this.pointsRemaining = this.possiblePoints;
    this.levelBegin = false;
  }
}