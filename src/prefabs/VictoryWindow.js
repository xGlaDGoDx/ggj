
// You can write more code here

/* START OF COMPILED CODE */

class VictoryWindow extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 375, y ?? 128);

		// victory_window
		const victory_window = scene.add.image(0, 159, "victory_window");
		this.add(victory_window);

		// button
		const button = new Button(scene, 188, -6);
		this.add(button);

		this.victory_window = victory_window;
		this.button = button;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.GameObjects.Image} */
	victory_window;
	/** @type {Button} */
	button;

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
