var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var attached = false;
var attachDown = false;
var attachedSprite = null;

var thingCt = 3;
var things = [];
var enemyCt = 60;
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
    var enemy = game.add.sprite(enemyX, enemyY, 'enemy');
    enemy.anchor.setTo(0.5, 0.5);
    enemy.speed = enemySpeed;
    game.physics.arcade.enable(enemy, Phaser.Physics.ARCADE);

    enemies.push(enemy);

    enemyY += 10;
    enemySpeed += 20;
  }

  player = game.add.sprite(400, 300, 'player');
  player.anchor.setTo(0.5, 0.5);
  player.angle = -90;

  game.physics.arcade.enable(player, Phaser.Physics.ARCADE);

  attach = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {

  for(var i=0; i<enemyCt; i++) {
    moveShip(enemies[i]);
  }

  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  player.body.angularVelocity = 0;

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    player.body.angularVelocity = -angularVelocity;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    player.body.angularVelocity = angularVelocity;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    game.physics.arcade.velocityFromAngle(player.angle, 300, player.body.velocity);
  } else {
    game.physics.arcade.velocityFromAngle(player.angle, 100, player.body.velocity);
  }

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
    attachedSprite.x = player.x;
    attachedSprite.y = player.y;       
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

function moveShip(sprite) {
  var d = distanceFromCenter(sprite);
  if (d > sprite.lastDistance && !safeZone.contains(sprite.x, sprite.y)) {
    sprite.body.angularVelocity = angularVelocity*2;
  } else {
    sprite.body.angularVelocity = 0;
  }
  sprite.lastDistance = d;
  game.physics.arcade.velocityFromAngle(sprite.angle, sprite.speed, sprite.body.velocity);
}

function attachIfNear(sprite) {
  if (attachedSprite === null && near(player, sprite)) {
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
