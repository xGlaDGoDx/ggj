
// You can write more code here

/* START OF COMPILED CODE */

class Hero extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 407, y ?? 157, texture || "__DEFAULT", frame);

		this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 32, 32), Phaser.Geom.Rectangle.Contains);
		scene.physics.add.existing(this, false);
		this.body.collideWorldBounds = true;
		this.body.onWorldBounds = true;
		this.body.setSize(32, 32, false);

		/* START-USER-CTR-CODE */
		this.gun = new Gun(scene, x, y, "dino");
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	left() {
		this.setVelocityX(-160);
	}

	right() {
		this.setVelocityX(160);
	}

	jump() {
		this.setVelocityY(-250);
	}

	stop() {
		this.setVelocityX(0);
	}

	synchronize(){
		this.gun.x = this.x;
		this.gun.y = this.y;
	}
}

/* END OF COMPILED CODE */

// You can write more code here
