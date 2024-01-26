
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

		// lists
		const colliders = [hero_1];
		const players = [hero, hero_1];
		const team1 = [hero];
		const team2 = [];

		this.terrain = terrain;
		this.hero = hero;
		this.bg = bg;
		this.timerText = timerText;
		this.hero_1 = hero_1;
		this.colliders = colliders;
		this.players = players;
		this.team1 = team1;
		this.team2 = team2;

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
	/** @type {Hero[]} */
	colliders;
	/** @type {Hero[]} */
	players;
	/** @type {Hero[]} */
	team1;
	/** @type {Array<any>} */
	team2;

	/* START-USER-CODE */

	// Write more your code here

	create() {
		this.editorCreate();

		let camera = this.camera = this.cameras.main;

		this.setCollision();

		this.setTimer();

		this.bg.setDepth(-1);

		camera.setPostPipeline()
		let blocks = this.terrain.all();
		blocks.forEach(element => {
			this.colliders.push(element.sprite);
		});
		this.physics.add.collider(this.players, this.colliders);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.changeMoveDebugButton = this.input.keyboard.addKey("Space").on("down", this.changePlayersMove.bind(this));

		this.targetHeroIndex = 0;

		this.setHeroTarget(this.targetHeroIndex);
	}

	setCollision() {
		this.terrain.all().forEach(block => {
			this.colliders.push(block.sprite);
		});

		this.physics.add.collider(this.players, this.colliders);
	}

	setTimer() {
		this.timer = this.time.addEvent({
			delay: 10000,
			callback: this.changePlayersMove,
			callbackScope: this,
			loop: true
		});

		this.updateTimerText();
		console.log(this.timer);
	}

	updateTimerText() {
		this.timerText.setText(Math.ceil(this.timer.getRemainingSeconds()));

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

		this.camera.pan(this.hero.x, this.hero.y, 500, Phaser.Math.Easing.Circular.InOut, true, (camera, progress) => {
			camera.panEffect.destination.x = this.hero.x;
			camera.panEffect.destination.y = this.hero.y;
			if (progress === 1) {
				camera.startFollow(this.hero, false, 0.1, 0.1);
			}
		});
	}

	update() {
		this.updateTimerText();

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

		this.input.on('pointermove', pointer =>
        {
			console.log(pointer);
			const bbox = {
                minX: pointer.worldX - 10,
                minY: pointer.worldY - 10,
                maxX: pointer.worldX + 10,
                maxY: pointer.worldY + 10
            };

			this.terrain.destroyArea(bbox);

        });
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
