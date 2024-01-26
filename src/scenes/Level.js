
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
		const terrain = new Terrain(this, -7, 337, "test_platform");
		this.add.existing(terrain);
		terrain.setOrigin(0, 0);

		// hero
		const hero = new Hero(this, 133, 15);
		this.add.existing(hero);

		// lists
		const colliders = [];
		const players = [hero];

		this.terrain = terrain;
		this.hero = hero;
		this.colliders = colliders;
		this.players = players;

		this.events.emit("scene-awake");
	}

	/** @type {Terrain} */
	terrain;
	/** @type {Hero} */
	hero;
	/** @type {Array<any>} */
	colliders;
	/** @type {Hero[]} */
	players;

	/* START-USER-CODE */

	// Write more your code here

	create() {
		this.editorCreate();
		let blocks = this.terrain.all();
		blocks.forEach(element => {
			this.colliders.push(element.sprite);
		});
		this.physics.add.collider(this.players, this.colliders);
		this.cursors = this.input.keyboard.createCursorKeys();
		console.log(this.cursors);
	}

	update() {

		if (this.cursors.left.isDown) {
			this.hero.setVelocityX(-160);

			// hero.anims.play('left', true);
		}
		else if (this.cursors.right.isDown) {
			this.hero.setVelocityX(160);

			// hero.anims.play('right', true);
		}
		else {
			this.hero.setVelocityX(0);

			// hero.anims.play('turn');
		}

		if (this.cursors.up.isDown) { //&& this.hero.body.touching.down)
			this.hero.setVelocityY(-150);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
