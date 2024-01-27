
// You can write more code here

/* START OF COMPILED CODE */

class Gun extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 559, y ?? 369, texture || "dino", frame);

		scene.add.existing(this, false);
		this.setOrigin(0.1, 0.5);
		/* START-USER-CTR-CODE */
		this.sc = scene;
		this.setAn
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	rotate(x, y){
		let angile = Phaser.Math.Angle.Between(x, y, this.x, this.y) - Math.PI;

		if (Math.abs(angile) > Math.PI / 2 && Math.abs(angile) < 3 * Math.PI / 2) {
			this.setFlipY(true);
			this.setDepth(1);
		} else {
			this.setFlipY(false);
			this.setDepth(-1);
		}

		this.setRotation(angile);
	}

	fire(x, y, power){
		let bullet = new Bullet(this.sc, this.sc.spine, this.x, this.y, x, y, power);
		this.sc.add.existing(bullet);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
