
// You can write more code here

/* START OF COMPILED CODE */

class Hero extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 594, y ?? 306, texture || "__DEFAULT", frame);

		this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 61, 60), Phaser.Geom.Rectangle.Contains);
		scene.physics.add.existing(this, false);
		this.body.collideWorldBounds = true;
		this.body.onWorldBounds = true;
		this.body.setSize(32, 60, false);

		/* START-USER-CTR-CODE */
		this.hp = 150;
		this.gun = new Gun(scene, x, y, "gun");
		this.moveSound = scene.sound.add("шаги");
	}

	/* START-USER-CODE */

	left() {
		this.setVelocityX(-160);
		this.play("move");
		if (this.body.touching.down) {
			this.moveSound.play();
		}
	}

	right() {
		this.setVelocityX(160);
		this.play("move");
		if (this.body.touching.down) {
			this.moveSound.play();
		}
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

		this.type = spine === "cat_banana" ? "cat" : "cap";
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

	addHpView(bgTexture){
		this.hpBackground = this.scene.add.sprite(this.x, this.y, bgTexture);
		this.hpBackground.setOrigin(0.5, 0.5);
		this.HpText = this.scene.add.text(this.x, this.y - 100, this.hp, {});
		this.HpText.setStroke("0xffffff", 2);
		this.HpText.setFont("Hitmo");
		this.HpText.setStyle({ "fontSize": "25px", "fontStyle": "bold" });
		this.HpText.setOrigin(0.5, 0.5);
	}

	synchronize(){
		this.gun.x = this.x;
		this.gun.y = this.y;
		if(this.HpText){
			this.HpText.x = this.x;
			this.hpBackground.x = this.x;
			this.HpText.y = this.y - 100;
			this.hpBackground.y = this.HpText.y;
		}
		this.heroAnim.setScale(this.gun.flipY ? -1 : 1, 1);

		this.heroAnim.x = this.x;
		this.heroAnim.y = this.y + 25;

		this.gun.x = this.heroAnim.x;
		this.gun.y = this.heroAnim.y;
	}

	clear() {
		this.left = this.right = this.stop = this.jump = () => {};
		this.heroAnim.setVisible(false);
		this.gun.setVisible(false);
		this.HpText.setVisible(false);
		this.hpBackground.setVisible(false);
	}

	onDamageBomb(centerX, centerY) {
		this.hp -= 50;
		if(this.HpText){
			this.HpText.text = this.hp;
		}

		if(this.hp <= 0){
			this.clear();

			if(this.type === "cap"){
				this.scene.showVictoryWindow("cap");
			}else{
				this.scene.showVictoryWindow("cat");
			}

			let grob = this.scene.add.image(this.x, this.y, `grob_${this.type}`)
			this.scene.physics.add.existing(grob);

			grob.body.collideWorldBounds = true;
			grob.body.onWorldBounds = true;

			this.scene.physics.add.collider(grob, this.scene.colliders);

			let arr = ['убийство-1', 'убийство-2', 'убийство-3', 'убийство-4'];
			let rand = Math.ceil(Math.random() * (arr.length - 1));
			let expSound = this.scene.sound.add(arr[rand]);
			expSound.play();

			return;
		}
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