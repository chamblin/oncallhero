var game = new Phaser.Game(800, 640, Phaser.AUTO, 'game', null);
game.state.add("playLevel", PlayLevel);
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

function loadLevel(resourceName){
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

  readyScreen();
}

function readyScreen(){
  stop = true;
  onReadyScreen = true;
  readyScreenBitmap = game.add.graphics(0, 0);
  readyScreenBitmap.beginFill(0);
  readyScreenBitmap.drawRect(0, 0, 900, 800);
  readyScreenLevelName = game.add.text(16, 16, 'Level ' + (currentLevel + 1), { font: '32px arial', fill: '#FFFFFF'});
  var text = map.properties.text || "";
  readyScreenHelpText = game.add.text(16, 64, text + "\n\nPress Space to Begin", {font: '12px arial', fill: '#FFFFFF'});
}

function beginLevel(){
  readyScreenHelpText.destroy();
  readyScreenLevelName.destroy();
  readyScreenBitmap.destroy();
  stop = false;
  onReadyScreen = false;
  levelBegin = game.time.now;
}

function reset(){
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
  loadLevel("level0");
}

function updateEnemies(){
  game.physics.arcade.collide(layer, enemies, function(enemy, layer){
   enemy.body.velocityFactor = -enemy.body.velocityFactor;
   enemy.body.velocity.y = enemy.body.velocityFactor * enemySpeed;
  });
}

function gameOver(){
  game.state.add("gameOver", GameOver);
  game.state.start("gameOver");
}

function win(){
  winSound.play();
  score += pointsRemaining;
  scoreText.content = "score: " + score;
  pager.kill();

  currentLevel += 1;
  if(currentLevel >= levels.length){
    gameOver();
  }
  else{
    loadLevel("level" + currentLevel);
  }
}

function lose(){
  loseSound.play();
  hero.kill();
  gameOver();
}
