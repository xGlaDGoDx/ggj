
// You can write more code here

/* START OF COMPILED CODE */

class VictoryWindow extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 375, y ?? 128);

		// button
		const button = new Button(scene, 188, -6, undefined, () => {
			scene.scene.start("Menu");
		});
		this.add(button);

		// light
		const light = scene.add.spine(-8, 144, "light", "light-atlas", new spine.SkinsAndAnimationBoundsProvider("animation", ["default"]));
		light.skeleton.setSkinByName("default");
		this.add(light);

		// victory_window
		const victory_window = scene.add.image(-4, 190, "victory_window");
		this.add(victory_window);

		this.button = button;
		this.victory_window = victory_window;

		/* START-USER-CTR-CODE */
		light.animationState.setAnimation(0, "animation", true);
		/* END-USER-CTR-CODE */
	}

	/** @type {Button} */
	button;
	/** @type {Phaser.GameObjects.Image} */
	victory_window;

	/* START-USER-CODE */

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
