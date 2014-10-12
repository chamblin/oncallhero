var game = new Phaser.Game(800, 640, Phaser.AUTO, 'game', null);
game.state.add("playLevel", PlayLevel);
game.state.add("gameOver", GameOver);
game.state.start("playLevel");

// stage
var map;
var layer;
var readyScreenBitmap;
var readyScreenLevelName;
var readyScreenHelpText;
var cursors;
var jumpSound;
var winSound;
var loseSound;
var gameOverBitmap;
var gameOverText;
var gameOverScore;

// sprites
var hero;
var pager;
var spikes;
var enemies;
var scoreText;
var remainingText;

// game state
var score = 0;
var stop = false;
var pointsRemaining;
var levels = Array(
  "levels/1.json", "levels/2.json", "levels/3.json", "levels/4.json", "levels/5.json", "levels/6.json", "levels/7.json"
);
var onReadyScreen = false;
var isGameOver = false;

var currentLevel = 0;

// level
var seconds;
var possiblePoints;
var levelBegin;
var enemySpeed = 100;

