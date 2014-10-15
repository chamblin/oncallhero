var Hero = function(game) {
  var sprite;
  var jumpSound;
  game.load.spritesheet("hero", "assets/Hero.png", 32, 32);
  game.load.audio("jump", "assets/jump.ogg");
}

Hero.prototype = {
  create: function(){
    this.sprite = game.add.sprite(-1000, -1000, "hero");
    game.physics.enable(this.sprite);
      this.sprite.body.bounce.y = 0.05;
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.setSize(16, 24, 8, 8);
      this.sprite.animations.add('left', [0,1], 5, true);
      this.sprite.animations.add('right', [3,4], 5, true);
      this.jumpSound = game.add.audio("jump");
  },

  collideWith: function(object2, collideCallback, processCallback, callbackContext){
    game.physics.arcade.collide(this.sprite, object2, collideCallback, processCallback, callbackContext);
  },

  stop: function() {
    this.sprite.body.velocity.x = 0;
  },

  place: function(position){
    this.sprite.x = position.x;
    this.sprite.y = position.y - this.sprite.height;
  },

  move: function(cursors){
    if (cursors.left.isDown){
      this.sprite.body.velocity.x = -150;
      this.sprite.animations.play("left");
    }
    else if (cursors.right.isDown){
      this.sprite.body.velocity.x = 150;
      this.sprite.animations.play("right");
    }
    else{
      this.sprite.animations.stop();
      this.sprite.frame = 2;
    }
    if((cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) && this.sprite.body.onFloor()){
      this.jumpSound.play();
      this.sprite.body.velocity.y = -250;
    }
  },

  revive: function(){
    this.sprite.revive();
  },

  die: function(){
    this.sprite.kill();
  }
}