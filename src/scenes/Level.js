
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
		const hero = new Hero(this, 867, 448);
		this.add.existing(hero);
		hero.removeInteractive();
		hero.setInteractive(new Phaser.Geom.Circle(15, 14, 89.1237011846265), Phaser.Geom.Circle.Contains);
		hero.body.setOffset(0, 0);
		hero.body.setSize(32, 32, false);

		// bg
		const bg = this.add.image(635, 525, "bg");

		// timerText
		const timerText = this.add.text(608, 407, "", {});
		timerText.text = "00";
		timerText.setStyle({ "fontSize": "50px", "fontStyle": "bold" });

		// hero_1
		const hero_1 = new Hero(this, 794, 449);
		this.add.existing(hero_1);
		hero_1.removeInteractive();
		hero_1.setInteractive(new Phaser.Geom.Circle(15, 14, 89.1237011846265), Phaser.Geom.Circle.Contains);
		hero_1.body.setOffset(0, 0);
		hero_1.body.setSize(32, 32, false);

		// gun
		const gun = new Gun(this, 640, 267);
		this.add.existing(gun);

		// lists
		const colliders = [hero_1];
		const players = [hero, hero_1];

		this.terrain = terrain;
		this.hero = hero;
		this.bg = bg;
		this.timerText = timerText;
		this.hero_1 = hero_1;
		this.gun = gun;
		this.colliders = colliders;
		this.players = players;
		
		this.events.emit("scene-awake");
	}

	/** @type {Terrain} */
	terrain;
	/** @type {Hero} */
	hero;
	/** @type {Phaser.GameObjects.Image} */
	bg;
	/** @type {Phaser.GameObjects.Text} */
	timerText;
	/** @type {Hero} */
	hero_1;
	/** @type {Gun} */
	gun;
	/** @type {Hero[]} */
	colliders;
	/** @type {Hero[]} */
	players;

	/* START-USER-CODE */

	// Write more your code here

	create() {
		this.editorCreate();

		let camera = this.camera = this.cameras.main;
		camera.setPostPipeline();

		this.setCollision();

		this.setCountTimer();
		this.updateTimer();

		this.bg.setDepth(-1);

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

            camera.zoomTo(Phaser.Math.Clamp(newZoom, 0.25, 2), 200);

            // Update camera matrix, so `getWorldPoint` returns zoom-adjusted coordinates.
            camera.preRender();
            const newWorldPoint = camera.getWorldPoint(pointer.x, pointer.y);
            // Scroll the camera to keep the pointer under the same world point.
            camera.scrollX -= newWorldPoint.x - worldPoint.x;
            camera.scrollY -= newWorldPoint.y - worldPoint.y;
        });

		this.input.on('pointerdown', pointer => {
			this.gun.fire(pointer.worldX, pointer.worldY);
		});

		this.input.on('pointermove', pointer =>
        {

			this.gun.rotate(pointer.worldX, pointer.worldY);

			// const bbox = {
            //     minX: pointer.worldX - 10,
            //     minY: pointer.worldY - 10,
            //     maxX: pointer.worldX + 10,
            //     maxY: pointer.worldY + 10
            // };

			// this.terrain.destroyArea(bbox);

        });
	}

	setDebug() {
		this.changeMoveDebugButton = this.input.keyboard.addKey("Space").on("down", this.changePlayersMove.bind(this));
	}

	setCollision() {
		this.terrain.all().forEach(block => {
			this.colliders.push(block.sprite);
		});

		this.physics.add.collider(this.players, this.colliders);
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
		else {
			this.hero.stop();
		}

		if (this.cursors.up.isDown && this.hero.body.touching.down) {
			this.hero.jump(); 
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
