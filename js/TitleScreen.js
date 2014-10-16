var TitleScreen = function(game) { };

TitleScreen.prototype = {
  preload: function() {
    game.load.image("titleScreen", "assets/title.png");

    // game assets
    game.stage.backgroundColor = "#7ec0ee";
    for(var i = 0; i < levels.length; i++){
      game.load.tilemap("level" + i, levels[i], null, Phaser.Tilemap.TILED_JSON);
    }
    game.load.image("ground_1x1", "assets/Ground.png");
    game.load.image("spike", "assets/Spike.png");
    game.load.image("spike_u", "assets/SpikeUpsideDown.png");
    game.load.image("enemy", "assets/Enemy.png");
    game.load.spritesheet("pager", "assets/Pager.png", 32, 32);
    game.load.audio("win", "assets/win.ogg");
    game.load.audio("lose", "assets/die.ogg");
  },

  create: function() {
    game.add.sprite(0, 0, "titleScreen");
  },

  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      currentLevel = 0;
      game.state.start("readyScreen");
    }
  }
}