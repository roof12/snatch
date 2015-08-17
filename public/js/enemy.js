Enemy = function(game, x, y, speed) {
  this.game = game;

  this.sprite = game.add.sprite(x, y, 'enemy');
  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.speed = speed;
  game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

}

Enemy.prototype.update = function() {
  var d = distanceFromCenter(this.sprite);
  if (d > this.sprite.lastDistance && !safeZone.contains(this.sprite.x, this.sprite.y)) {
    this.sprite.body.angularVelocity = angularVelocity*2;
  } else {
    this.sprite.body.angularVelocity = 0;
  }
  this.sprite.lastDistance = d;
  game.physics.arcade.velocityFromAngle(this.sprite.angle, this.sprite.speed, this.sprite.body.velocity);
}
