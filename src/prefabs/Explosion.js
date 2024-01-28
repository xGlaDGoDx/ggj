
// You can write more code here

/* START OF COMPILED CODE */

class Explosion extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 356, y ?? 273, texture || "__DEFAULT", frame);

		/* START-USER-CTR-CODE */
		this.setSpine("explosion");
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	setSpine(spine) {
		this.heroAnim = this.scene.add.spine(this.x, this.y, spine, `${spine}-atlas`);
		this.heroAnim.setDepth(2);
		this.heroAnim.animationState.setAnimation(0, "animation", false);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
