
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
		const hero = new Hero(this, 133, 15);
		this.add.existing(hero);
		hero.removeInteractive();
		hero.setInteractive(new Phaser.Geom.Circle(15, 14, 89.1237011846265), Phaser.Geom.Circle.Contains);
		hero.body.setOffset(0, 0);
		hero.body.setSize(32, 32, false);

		// bg
		const bg = this.add.image(635, 525, "bg");

		// timerText
		const timerText = this.add.text(60, 154, "", {});
		timerText.text = "00";
		timerText.setStyle({ "fontSize": "50px", "fontStyle": "bold" });

		// lists
		const colliders = [];
		const players = [hero];
		const team1 = [hero];
		const team2 = [];

		this.terrain = terrain;
		this.hero = hero;
		this.bg = bg;
		this.timerText = timerText;
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
	/** @type {Array<any>} */
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

		this.setCollision();

		this.setTimer();

		this.bg.setDepth(-1);

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
		});

		this.updateTimerText();
		console.log(this.timer);
	}

	updateTimerText() {
		this.timerText.setText(Math.round(this.timer / 1000))
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

		if (this.cursors.left.isDown && !this.hero.body.touching.left) {
			this.hero.left();

			// hero.anims.play('left', true);
		}
		else if (this.cursors.right.isDown && !this.hero.body.touching.right) {
			this.hero.right();

			// hero.anims.play('right', true);
		}
		else {
			this.hero.stop();

			// hero.anims.play('turn');
		}

		if (this.cursors.up.isDown && this.hero.body.touching.down) {
			this.hero.jump(); 
		}

		this.updateTimerText();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
