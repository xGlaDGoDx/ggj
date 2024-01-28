
// You can write more code here

/* START OF COMPILED CODE */

class Button extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 366, y ?? 234, texture || "close_button", frame);
		/* START-USER-CTR-CODE */
		this.setInteractive({ useHandCursor: true });
		this.curText = texture || "close_button";
		this.on("pointerdown", ()=> {
			this.setTexture("close_button_on");
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
