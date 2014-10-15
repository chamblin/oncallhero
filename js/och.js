// game configuration

var ENEMY_SPEED = 100;

// game state
var score = 0;
var stop = false;
var levels = Array(
  "levels/1.json", "levels/2.json", "levels/3.json", "levels/4.json", "levels/5.json", "levels/6.json", "levels/7.json"
);
var onReadyScreen = false;
var currentLevel = 0;

// initialize the game

var game = new Phaser.Game(800, 640, Phaser.AUTO, 'game', null);
game.state.add("playLevel", PlayLevel);
game.state.add("gameOver", GameOver);
game.state.add("titleScreen", TitleScreen);
game.state.start("titleScreen");