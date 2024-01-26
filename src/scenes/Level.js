
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
		const hero = new Hero(this, 133, 596);
		this.add.existing(hero);
		hero.removeInteractive();
		hero.setInteractive(new Phaser.Geom.Circle(15, 14, 89.1237011846265), Phaser.Geom.Circle.Contains);
		hero.body.setOffset(0, 0);
		hero.body.setSize(32, 32, false);

		// bg
		const bg = this.add.image(635, 525, "bg");

		// hero_1
		const hero_1 = new Hero(this, 245, 587);
		this.add.existing(hero_1);

		// lists
		const colliders = [];
		const players = [hero, hero_1];
		const team1 = [hero];
		const team2 = [hero_1];

		this.terrain = terrain;
		this.hero = hero;
		this.bg = bg;
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
	/** @type {Array<any>} */
	colliders;
	/** @type {Hero[]} */
	players;
	
	/* START-USER-CODE */

	// Write more your code here

	create() {
		this.editorCreate();
		this.bg.setDepth(-1);

		let camera = this.cameras.main;
		camera.setViewport(0, 0, 1280, 720);
		//camera.startFollow(this.hero);
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
			delay: 2000,
			callback: this.changePlayersMove,
			callbackScope: this,
			loop: true
		})
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
	}

	update() {

		if (this.cursors.left.isDown && !this.hero.body.touching.right) {
			this.hero.setVelocityX(-160);

			// hero.anims.play('left', true);
		}
		else if (this.cursors.right.isDown && !this.hero.body.touching.left) {
			this.hero.setVelocityX(160);

			// hero.anims.play('right', true);
		}
		else {
			this.hero.setVelocityX(0);

			// hero.anims.play('turn');
		}

		if (this.cursors.up.isDown && this.hero.body.touching.down) {
			this.hero.setVelocityY(-250); 
		}

		this.input.on('pointermove', pointer =>
        {
			const bbox = {
                minX: pointer.x - 10,
                minY: pointer.y - 10,
                maxX: pointer.x + 10,
                maxY: pointer.y + 10
            };

			this.terrain.destroyArea(bbox);

        });
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
