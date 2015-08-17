Player = function(game, x, y, speed) {
  this.game = game;

  this.sprite = game.add.sprite(game.width / 2, game.height / 2, 'player');
  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.angle = -90;

  game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

}

Player.prototype.update = function() {
  this.sprite.body.velocity.x = 0;
  this.sprite.body.velocity.y = 0;
  this.sprite.body.angularVelocity = 0;

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    this.sprite.body.angularVelocity = -angularVelocity;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    this.sprite.body.angularVelocity = angularVelocity;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    game.physics.arcade.velocityFromAngle(this.sprite.angle, 300, this.sprite.body.velocity);
  } else {
    game.physics.arcade.velocityFromAngle(this.sprite.angle, 100, this.sprite.body.velocity);
  }
}
