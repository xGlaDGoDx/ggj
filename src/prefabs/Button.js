
// You can write more code here

/* START OF COMPILED CODE */

class Button extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture = "close_button", callback, frame) {
		super(scene, x ?? 366, y ?? 234, texture, frame);
		/* START-USER-CTR-CODE */
		this.setInteractive({ useHandCursor: true });
		this.curText = texture || "close_button";
		this.on("pointerdown", () => {
			this.setTexture(`${texture}_on`);
			if (callback) {
				callback();
			}
		});
		this.on("pointerup", ()=> {
			this.setTexture(this.curText);
		});
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
