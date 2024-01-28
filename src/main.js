
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 1280,
		height: 720,
		type: Phaser.AUTO,
        backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		physics:{
			default: "arcade",
			arcade:{
				gravity: {y:750},
				debug: false
			}
		},
		plugins: {
			scene: [{
				key: "spine.SpinePlugin",
				plugin: spine.SpinePlugin,
				mapping: "spine"
			  }]
		}
	});

	game.scene.add("Preload", Preload);
	game.scene.add("Menu", Menu);
	game.scene.add("Level", Level);
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {

		this.scene.start("Preload");
	}
}