
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

		// progressBar
		const progressBar = this.add.rectangle(640, 600, 500, 20);
		progressBar.setOrigin(0.5, 0.5);
		progressBar.isFilled = true;
		progressBar.fillColor = 32767;

		// preloadUpdater
		new PreloadBarUpdaterScript(progressBar);

		// loadingText
		const loadingText = this.add.text(640, 520, "", {});
		loadingText.text = "Loading...";
		loadingText.setStyle({ "fontSize": "50px", "fontStyle": "bold", "stroke": "#050505ff", "strokeThickness":2});
		loadingText.setOrigin(0.5, 0.5);

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	preload() {

		this.editorCreate();

		this.editorPreload();

		this.load.on(Phaser.Loader.Events.COMPLETE, () => console.log(123));
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
