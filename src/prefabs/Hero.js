
// You can write more code here

/* START OF COMPILED CODE */

class Hero extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 594, y ?? 306, texture || "__DEFAULT", frame);

		this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 61, 96), Phaser.Geom.Rectangle.Contains);
		scene.physics.add.existing(this, false);
		this.body.collideWorldBounds = true;
		this.body.onWorldBounds = true;
		this.body.setSize(32, 96, false);

		/* START-USER-CTR-CODE */
		this.gun = new Gun(scene, x, y, "gun");
	}

	/* START-USER-CODE */

	left() {
		this.setVelocityX(-160);
		this.play("animation");
	}

	right() {
		this.setVelocityX(160);
		this.play("animation");
	}

	jump() {
		this.jumpAnimation = true;
		setTimeout(() => {
			this.setVelocityY(-250);
			this.jumpAnimation = false;
		}, 100);
		this.play("jump", false);
	}

	stop() {
		if (this.body.touching.down) {
			this.setVelocityX(0);
			this.play("idle");
		}
	}

	setSpine(spine) {
		this.heroAnim = this.scene.add.spine(this.x, this.y, spine, `${spine}-atlas`);
		this.heroAnim.setDepth(2);

		this.heroAnim.animationState.setAnimation(0, "idle", true);
		this.currentAnim = "idle";

		if (spine === "cat_banana") { // rotate hero on enemy side
			this.gun.rotate(this.x - 1, this.y);
		}
	}

	play(anim, loop = true) {
		if (this.currentAnim !== anim) {
			if (anim !== "jump" && this.jumpAnimation || !this.heroAnim) {
				return;
			}

			this.heroAnim.animationState.setAnimation(0, anim, loop);
			this.currentAnim = anim;
		}
	}

	synchronize(){
		this.heroAnim.setScale(this.gun.flipY ? -1 : 1, 1);

		this.heroAnim.x = this.x;
		this.heroAnim.y = this.y + 48;

		this.gun.x = this.heroAnim.x;
		this.gun.y = this.heroAnim.y;
	}

	onDamageBomb(centerX, centerY) {
		let angle = new Phaser.Math.Vector2(this.x - centerX, this.y - centerY);
		angle.normalize();

		let power = 500;

		this.onTakeDamage = true;
		setTimeout(() => {
			if (angle.y > -0.3) {
				angle.y = -0.3;
			}
			this.setVelocity(angle.x * power, angle.y * power);
			this.onTakeDamage = false; 
		}, 0);
	}
}