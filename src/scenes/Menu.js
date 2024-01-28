
// You can write more code here

/* START OF COMPILED CODE */

class Menu extends Phaser.Scene {

	constructor() {
		super("Menu");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// menu_bg
		const menu_bg = this.add.image(653, 367, "menu_bg");
		menu_bg.scaleX = 0.9;
		menu_bg.scaleY = 0.9;

		// button
		const button = new Button(this, 640, 594, "green_button", () => {
			setTimeout(() => {
				this.sound.stopAll();
				this.scene.start("Level");
			}, 50);
		});
		this.add.existing(button);

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {
		let expSound = this.sound.add('ost');
		expSound.play();
		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
