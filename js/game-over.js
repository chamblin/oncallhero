var GameOver = function(game) { };

GameOver.prototype = {
  preload: function() {
    game.load.image("gameover", "assets/GameOver.png");
  },

  create: function() {
    game.add.sprite(0, 0, "gameover");
    gameOverScore = game.add.text(16, 64, "Your score: " + score + ". Press Space to Restart", {font: '12px arial', fill: '#FFFFFF'});
  },

  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      currentLevel = 0;
      game.state.start("playLevel");
    }
  }
}