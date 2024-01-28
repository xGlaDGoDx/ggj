
// You can write more code here

/* START OF COMPILED CODE */

class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */

		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorPreload() {

		this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	/** @returns {void} */
	editorCreate() {

		// loading
		const loading = this.add.image(655, 368, "loading");
		loading.scaleX = 0.9;
		loading.scaleY = 0.9;

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	preload() {

		this.editorCreate();

		this.create()

		this.editorPreload();

		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Level"));
	}

	create() {
		this.add.image(640, 600, "bar_bg");

		const progressBar = this.add.rectangle(640, 600, 710, 18);
		progressBar.setOrigin(0.5, 0.5);
		progressBar.isFilled = true;
		progressBar.fillColor = 32767;

		new PreloadBarUpdaterScript(progressBar);

		const loadingText = this.add.text(500, 545, "", {});
		loadingText.text = "Loading";
		let i = 0;
		setInterval(() => {
			if (i < 3) {
				loadingText.text += ".";
				i++;
			} else {
				loadingText.text = "Loading";
				i = 0;
			}
		}, 700);
		loadingText.setOrigin(0, 0.5)
		loadingText.setStyle({ "fontSize": "50px", "fontStyle": "bold", "stroke": "#050505ff", "strokeThickness":2});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
