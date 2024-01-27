
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// terrain
		const terrain = new Terrain(this, -3, 205, "test_platform");
		this.add.existing(terrain);
		terrain.setOrigin(0, 0);

		// hero
		const hero = new Hero(this, 731, 432);
		this.add.existing(hero);
		hero.removeInteractive();
		hero.setInteractive(new Phaser.Geom.Circle(15, 14, 89.1237011846265), Phaser.Geom.Circle.Contains);
		hero.body.setOffset(0, 0);
		hero.body.setSize(32, 32, false);

		// timerText
		const timerText = this.add.text(608, 407, "", {});
		timerText.text = "00";
		timerText.setStyle({ "fontSize": "50px", "fontStyle": "bold" });

		// hero_1
		const hero_1 = new Hero(this, 791, 446);
		this.add.existing(hero_1);
		hero_1.removeInteractive();
		hero_1.setInteractive(new Phaser.Geom.Circle(15, 14, 89.1237011846265), Phaser.Geom.Circle.Contains);
		hero_1.body.setOffset(0, 0);
		hero_1.body.setSize(32, 32, false);

		// lists
		const colliders = [];
		const players = [hero, hero_1];
		const bullets = [];

		this.terrain = terrain;
		this.hero = hero;
		this.timerText = timerText;
		this.hero_1 = hero_1;
		this.colliders = colliders;
		this.players = players;
		this.bullets = bullets;

		this.events.emit("scene-awake");
	}

	/** @type {Terrain} */
	terrain;
	/** @type {Hero} */
	hero;
	/** @type {Phaser.GameObjects.Text} */
	timerText;
	/** @type {Hero} */
	hero_1;
	/** @type {Array<any>} */
	colliders;
	/** @type {Hero[]} */
	players;
	/** @type {Array<any>} */
	bullets;

	/* START-USER-CODE */

	// Write more your code here

	create() {
		this.editorCreate();

		this.graphics = this.add.graphics()

		let camera = this.camera = this.cameras.main;
		camera.setPostPipeline();

		this.setCollision();

		this.setCountTimer();
		this.updateTimer();

		this.targetHeroIndex = 0;
		this.setHeroTarget(this.targetHeroIndex);

		this.cursors = this.input.keyboard.createCursorKeys();

		console.log(this.camera.zoom);
		this.addMouseControl();

		this.setDebug();
	}

	addMouseControl() {
		this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            // Get the current world point under pointer.

			let camera = this.camera;

            const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
            const newZoom = camera.zoom - camera.zoom * 0.0015 * deltaY;

            camera.zoomTo(Phaser.Math.Clamp(newZoom, 0.5, 1.5), 200);

            // Update camera matrix, so `getWorldPoint` returns zoom-adjusted coordinates.
            camera.preRender();
            const newWorldPoint = camera.getWorldPoint(pointer.x, pointer.y);
            // Scroll the camera to keep the pointer under the same world point.
            camera.scrollX -= newWorldPoint.x - worldPoint.x;
            camera.scrollY -= newWorldPoint.y - worldPoint.y;
        });

		this.input.on('pointerdown', pointer => {
			this.hero.gun.fire(pointer.worldX, pointer.worldY, 900);
		});

		this.input.on('pointermove', pointer =>
        {
			this.hero.gun.rotate(pointer.worldX, pointer.worldY);
        });
	}

	onExplosion(explosionArea) {
		this.terrain.destroyArea(explosionArea);

		this.players.forEach(player => {
			let rect = new Phaser.Geom.Rectangle(explosionArea.x - 100, explosionArea.y - 100, 200, 200);

			if (rect.contains(player.x, player.y)) {
				player.onDamageBomb(rect.centerX, rect.centerY);
			}
		})
	}

	setDebug() {
		this.changeMoveDebugButton = this.input.keyboard.addKey("Space").on("down", this.changePlayersMove.bind(this));
	}

	setCollision() {
		this.terrain.all().forEach(block => {
			this.colliders.push(block.sprite);
		});

		this.physics.add.collider(this.players, this.colliders);
		this.physics.add.overlap(this.bullets, this.colliders, (bullet, block) => {
			bullet.onCollide();
		});
	}

	setCountTimer() {
		this.countTimer = this.time.addEvent({
			delay: 10000,
			callback: this.changePlayersMove,
			callbackScope: this,
			loop: true
		});
	}

	updateTimer() {
		this.updateTimerPosition();
		this.updateTimerText();
	}

	updateTimerText() {
		this.timerText.setText(Math.ceil(this.countTimer.getRemainingSeconds()));
	}

	updateTimerPosition() {
		let worldView = this.camera.worldView;

		this.timerText.setPosition(worldView.x + 50, worldView.y + 50);
	}

	changePlayersMove() {
		this.targetHeroIndex = (this.targetHeroIndex + 1) % this.players.length;

		console.log("change target:", this.targetHeroIndex);
		this.setHeroTarget(this.targetHeroIndex);
	}

	setHeroTarget(index) {
		if (this.hero) {
			this.hero.stop();
		}

		this.hero = this.players[index];
		this.hero.isTargetHero = true;

		this.changeCameraFocus(this.hero);
	}

	changeCameraFocus(target) {
		this.camera.pan(target.x, target.y, 500, Phaser.Math.Easing.Circular.InOut, true, (camera, progress) => {
			camera.panEffect.destination.x = target.x;
			camera.panEffect.destination.y = target.y;
			if (progress === 1) {
				camera.startFollow(target, false, 0.1, 0.1);
			}
		});
	}

	update() {
		this.updateTimer();

		if (this.cursors.left.isDown && !this.hero.body.touching.right) {
			this.hero.left();
		}
		else if (this.cursors.right.isDown && !this.hero.body.touching.left) {
			this.hero.right();
		} 
		else if (!this.hero.onTakeDamage) {
			this.hero.stop();
		}

		if (this.cursors.up.isDown && this.hero.body.touching.down) {
			this.hero.jump(); 
		}

		this.players.forEach((player) =>{
			player.synchronize();
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
