
// You can write more code here

/* START OF COMPILED CODE */

class Hero extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 594, y ?? 306, texture || "__DEFAULT", frame);
		this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 61, 96), Phaser.Geom.Rectangle.Contains);
		scene.physics.add.existing(this, false);
		this.body.collideWorldBounds = true;
		this.body.onWorldBounds = true;
		this.body.setCircle(9);
		this.hp = 200;
		this.addHpView();
		/* START-USER-CTR-CODE */
		this.gun = new Gun(scene, x, y, "gun");
		this.heroAnim = scene.add.spine(this.x, this.y, 'capibara', 'capibara-atlas');
		this.heroAnim.setDepth(2);

		this.heroAnim.animationState.setAnimation(0, "idle", true);
		this.currentAnim = "idle";
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

	play(anim, loop = true) {
		if (this.currentAnim !== anim) {
			if (anim !== "jump" && this.jumpAnimation) {
				return;
			}
			
			this.heroAnim.animationState.setAnimation(0, anim, loop);
			this.currentAnim = anim;
		}
	}

	addHpView(){
		this.HpText = this.scene.add.text(this.x, this.y - 100, this.hp, {});
		this.HpText.setStyle({ "fontSize": "25px", "fontStyle": "bold" });
	}

	synchronize(){
		this.gun.x = this.x;
		this.gun.y = this.y;
		if(this.HpText){
			this.HpText.x = this.x - this.HpText.text.length * 25 / 2;
			this.HpText.y = this.y - 100;
		}
		this.heroAnim.setScale(this.gun.flipY ? -1 : 1, 1);

		this.heroAnim.x = this.x;
		this.heroAnim.y = this.y;
	}

	onDamageBomb(centerX, centerY) {
		let angle = new Phaser.Math.Vector2(this.x - centerX, this.y - centerY);
		angle.normalize();

		console.log(angle)
		let power = 500;

		this.onTakeDamage = true;
		setTimeout(() => {
			this.setVelocity(angle.x * power, Phaser.Math.Clamp(angle.y, -0.5, -1) * power);
			this.onTakeDamage = false; 
		}, 0);
	}

}

/* END OF COMPILED CODE */

// You can write more code here
/* END-USER-CODE */

/* END OF COMPILED CODE */

// You can write more code here
/* END-USER-CODE */

/* END OF COMPILED CODE */

// You can write more code here
/* END-USER-CODE */

/* END OF COMPILED CODE */

// You can write more code here
