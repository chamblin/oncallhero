var TitleScreen = function(game) { };

TitleScreen.prototype = {
  preload: function() {
    game.load.image("titleScreen", "assets/title.png");
  },

  create: function() {
    game.add.sprite(0, 0, "titleScreen");
  },

  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      currentLevel = 0;
      game.state.start("playLevels");
    }
  }
}