var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var attached = false;
var attachDown = false;
var attachedSprite = null;

var thingCt = 3;
var things = [];
var enemyCt = 30;
var enemies = [];

var angularVelocity = 320;
var boundingBox = 30;

var buffer = 120;
var safeZone = new Phaser.Polygon([
  new Phaser.Point(buffer, buffer),
  new Phaser.Point(game.width - buffer, buffer),
  new Phaser.Point(game.width-buffer, game.height-buffer),
  new Phaser.Point(buffer, game.height-buffer)
]);

function preload() {
  game.load.image('player', 'assets/ship.gif');
  game.load.image('thing', 'assets/thing.png');
  game.load.image('enemy', 'assets/enemy.gif');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  var thingX = 345;
  var thingY = 330;
  for (var i=0; i<thingCt; i++) {
    var thing = game.add.sprite(thingX, thingY, 'thing');
    thing.anchor.setTo(0.5, 0.5);
    things.push(thing);
    thingX += 40;
  }

  var enemyX = 50;
  var enemyY = 50;
  var enemySpeed = 60;
  for(var i=0; i<enemyCt; i++) {
    enemies.push(new Enemy(game, enemyX, enemyY, enemySpeed));
    enemyY += 10;
    enemySpeed += 20;
  }

  player = new Player(game);

  attach = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.phase = 'start';
}

function update() {
  if (game.phase === 'start') {
    game.debug.text('Press any key to start', 200, 200, 'rgb(0,255,0)');
  } else {
    for(var i=0; i<enemyCt; i++) {
      enemies[i].update();
    }

    player.update();

    if (attach.isDown && !attachDown) {
      attachDown = true;
    }
    if (attach.isUp && attachDown) {
      attachDown = false;
      if (attachedSprite) {
        detachSprite();
      } else {
        for(var i=0; i<thingCt; i++) {
          attachIfNear(things[i]);
        }
      }
    }

    if (attachedSprite) {
      attachedSprite.x = player.sprite.x;
      attachedSprite.y = player.sprite.y;       
    }

  }
}

function distance(x0, y0, x1, y1) {
  return Math.sqrt(Math.pow(x1-x0,2) + Math.pow(y1-y0,2))
}

function distanceFromCenter(sprite) {
  return distance(game.width/2, game.height/2, sprite.x, sprite.y);
}

function distanceFromEdge(sprite) {
  return Math.min(
    distance(sprite.x, sprite.y, 0, 0),
    distance(sprite.x, sprite.y, 800, 0),
    distance(sprite.x, sprite.y, 0, 600),
    distance(sprite.x, sprite.y, 800, 600)
  )
}

function attachIfNear(sprite) {
  if (attachedSprite === null && near(player.sprite, sprite)) {
    attachSprite(sprite);
  }
}

function near(sprite0, sprite1) {
  var dx = Math.abs(sprite0.x - sprite1.x);
  var dy = Math.abs(sprite0.y - sprite1.y);
  return (dx < boundingBox) && (dy < boundingBox);
}

function detachSprite() {
  attachedSprite = null;
}

function attachSprite(sprite) {
  attachedSprite = sprite;
}
