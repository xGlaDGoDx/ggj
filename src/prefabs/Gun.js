
// You can write more code here

/* START OF COMPILED CODE */

class Gun extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 559, y ?? 369, texture || "dino", frame);

		scene.add.existing(this, false);
		this.setOrigin(0.1, 0.5);
		/* START-USER-CTR-CODE */
		this.sc = scene;
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	rotate(x, y){
		let angile = Phaser.Math.Angle.Between(x, y, this.x, this.y) - Math.PI;

		if (Math.abs(angile) > Math.PI / 2 && Math.abs(angile) < 3 * Math.PI / 2) {
			this.setFlipY(true);
		} else {
			this.setFlipY(false);
		}

		this.setRotation(angile);
	}

	fire(x, y, power){
		let bullet = new Bullet(this.sc, this.x, this.y, x, y, power, "bullet");
		this.sc.add.existing(bullet);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
