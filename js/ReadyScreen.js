var ReadyScreen = function(game) {
  var map;
  var readyScreenBitmap;
  var readyScreenLevelName;
  var readyScreenHelpText;
};

ReadyScreen.prototype = {
  create: function(){
    this.map = game.add.tilemap("level" + currentLevel);
    this.readyScreenBitmap = game.add.graphics(0, 0);
    this.readyScreenBitmap.beginFill(0);
    this.readyScreenBitmap.drawRect(0, 0, 900, 800);
    this.readyScreenLevelName = game.add.text(16, 16, 'Level ' + (currentLevel + 1), { font: '32px arial', fill: '#FFFFFF'});
    var text = this.map.properties.text || "";
    this.readyScreenHelpText = game.add.text(16, 64, text + "\n\nPress Space to Begin", {font: '12px arial', fill: '#FFFFFF'});
  },

  update: function(){
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      game.state.start("playLevel");
    }
  }
}