
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

		// bg
		const bg = this.add.image(728, 398, "bg");

		// terrain
		const terrain = new Terrain(this, 0, 281, "island");
		this.add.existing(terrain);
		terrain.setOrigin(0, 0);

		// hero
		const hero = new Hero(this, 190, 257);
		this.add.existing(hero);
		hero.removeInteractive();
		hero.setInteractive(new Phaser.Geom.Circle(15, 14, 89.1237011846265), Phaser.Geom.Circle.Contains);
		hero.body.setOffset(0, 0);

		// timerText
		const timerText = this.add.text(608, 407, "", {});
		timerText.setOrigin(0.5, 0.25);
		timerText.text = "00";
		timerText.setStyle({ "fontSize": "50px", "fontStyle": "bold", "stroke": "#050505ff", "strokeThickness":2});

		// hero_1
		const hero_1 = new Hero(this, 1205, 152);
		this.add.existing(hero_1);
		hero_1.removeInteractive();
		hero_1.setInteractive(new Phaser.Geom.Circle(15, 14, 89.1237011846265), Phaser.Geom.Circle.Contains);
		hero_1.body.setOffset(0, 0);

		// timer_bg
		const timer_bg = this.add.image(610, 420, "timer_bg");

		// victoryWindow
		const victoryWindow = new VictoryWindow(this, 592, 288);
		this.add.existing(victoryWindow);

		// lists
		const colliders = [];
		const players = [hero, hero_1];
		const bullets = [];
		const team1 = [hero_1];
		const team2 = [hero];

		this.bg = bg;
		this.terrain = terrain;
		this.hero = hero;
		this.timerText = timerText;
		this.hero_1 = hero_1;
		this.timer_bg = timer_bg;
		this.victoryWindow = victoryWindow;
		this.colliders = colliders;
		this.players = players;
		this.bullets = bullets;
		this.team1 = team1;
		this.team2 = team2;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	bg;
	/** @type {Terrain} */
	terrain;
	/** @type {Hero} */
	hero;
	/** @type {Phaser.GameObjects.Text} */
	timerText;
	/** @type {Hero} */
	hero_1;
	/** @type {Phaser.GameObjects.Image} */
	timer_bg;
	/** @type {VictoryWindow} */
	victoryWindow;
	/** @type {Array<any>} */
	colliders;
	/** @type {Hero[]} */
	players;
	/** @type {Array<any>} */
	bullets;
	/** @type {Hero[]} */
	team1;
	/** @type {Hero[]} */
	team2;

	/* START-USER-CODE */
	// Write more your code here

	create() {
		this.editorCreate();

		this.terrain.createMap(Math.ceil(Math.random() * 3));

		this.sound.play("mainGame", {
			volume: 0.2,
			loop: true
		});

		this.createBg();
		this.teamsInit();
		this.victoryWindow.setVisible(false);
		this.graphics = this.add.graphics()

		let camera = this.camera = this.cameras.main;
		this.physics.world.setBounds(0, 0, 1425, 800);
		camera.setBounds(0, 0, 1425, 800);

		console.log(this)

		camera.setPostPipeline();

		console.log(this);

		this.setCollision();

		this.setCountTimer();
		this.timerText.setDepth(100);
		this.timer_bg.setDepth(99);
		this.updateTimer();

		this.targetHeroIndex = 0;
		this.setHeroTarget(this.targetHeroIndex);

		this.cursors = this.input.keyboard.createCursorKeys();

		console.log(this.camera.zoom);
		this.addMouseControl();

		this.setDebug();
	}

	createBg() {
		this.bg.setDepth(-1);
	}

	teamsInit() {
		this.team2.forEach((hero) => {
			hero.setSpine("capibara");
			hero.addHpView("hp_bg_green");
		});

		this.team1.forEach((hero) => {
			hero.setSpine("cat_banana");
			hero.addHpView("hp_bg_red");
		});
	}

	addMouseControl() {
		this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            // Get the current world point under pointer.

			let camera = this.camera;

            const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
            const newZoom = camera.zoom - camera.zoom * 0.0015 * deltaY;

            camera.zoomTo(Phaser.Math.Clamp(newZoom, 1, 1.5), 200);

            // Update camera matrix, so `getWorldPoint` returns zoom-adjusted coordinates.
            camera.preRender();
            const newWorldPoint = camera.getWorldPoint(pointer.x, pointer.y);
            // Scroll the camera to keep the pointer under the same world point.
            camera.scrollX -= newWorldPoint.x - worldPoint.x;
            camera.scrollY -= newWorldPoint.y - worldPoint.y;
        });

		this.input.on('pointerdown', pointer => {
			this.hero.gun.fire(pointer.worldX, pointer.worldY, 700);
		});

		this.input.on('pointermove', pointer =>
        {
			this.hero.gun.rotate(pointer.worldX, pointer.worldY);
        });
	}

	onExplosion(explosionArea) {
		this.terrain.destroyArea(explosionArea);

		this.players.forEach(player => {
			let rect = new Phaser.Geom.Rectangle(explosionArea.x - 100, explosionArea.y - 100, 200, 200);

			if (rect.contains(player.x, player.y)) {
				player.onDamageBomb(rect.centerX, rect.centerY);
			}
		})
	}

	setDebug() {
		this.changeMoveDebugButton = this.input.keyboard.addKey("H").on("down", this.changePlayersMove.bind(this));
	}

	setCollision() {
		this.terrain.all().forEach(block => {
			this.colliders.push(block.sprite);
		});

		this.physics.add.collider(this.players, this.colliders);
		this.physics.add.collider(this.bullets, this.colliders, (bullet, block) => {
			bullet.onCollide();
		});
	}

	setCountTimer() {
		this.countTimer = this.time.addEvent({
			delay: 10000,
			callback: this.changePlayersMove,
			callbackScope: this,
			loop: true
		});
	}

	updateTimer() {
		this.updateTimerPosition();
		this.updateTimerText();
	}

	updateTimerText() {
		this.timerText.setText(Math.ceil(this.countTimer.getRemainingSeconds()));
	}

	showVictoryWindow(type){
		if(type === "cap"){
			this.victoryWindow.victory_window.setTexture("victory_window_cat");
		}else{
			this.victoryWindow.victory_window.setTexture("victory_window_capy");
		}
		let worldView = this.camera.worldView;
		this.victoryWindow.setPosition(worldView.x + 1280 / 2, worldView.y + 720 / 2);
		this.victoryWindow.setVisible(true);
	}
	updateTimerPosition() {
		let worldView = this.camera.worldView;
		this.timer_bg.setPosition(worldView.x + 100, worldView.y + 580);
		this.timerText.setPosition(worldView.x + 100, worldView.y + 580);
	}

	updateVictoryWindowPosition(){
		let worldView = this.camera.worldView;
		this.victoryWindow.setPosition(worldView.x + 1280 / 2, worldView.y + 720 / 4);
	}

	changePlayersMove() {
		let arr = ['фраза на ход-1', 'фраза на ход-2', 'фраза на ход-3', 'фраза на ход-4(лоу хп)', 'убийство-1', 'убийство-2', 'убийство-3', 'убийство-4'];
		let rand = Math.ceil(Math.random() * (arr.length - 1));
		let expSound = this.sound.add(arr[rand]);
        expSound.play();
		this.targetHeroIndex = (this.targetHeroIndex + 1) % this.players.length;

		console.log("change target:", this.targetHeroIndex);
		this.setHeroTarget(this.targetHeroIndex);
	}

	setHeroTarget(index) {
		if (this.hero) {
			this.hero.isTargetHero = false;
			this.hero.stop();
		}

		this.hero = this.players[index];
		this.hero.gun.ammo = 2;
		this.hero.isTargetHero = true;

		this.changeCameraFocus(this.hero);
	}

	changeCameraFocus(target) {
		this.camera.pan(target.x, target.y, 500, Phaser.Math.Easing.Circular.InOut, true, (camera, progress) => {
			camera.panEffect.destination.x = target.x;
			camera.panEffect.destination.y = target.y;
			if (progress === 1) {
				camera.startFollow(target, false, 0.1, 0.1);
			}
		});
	}

	checkCameraInScene() {
		let worldView = this.camera.worldView;

		if (worldView.left <= 10 || worldView.right >= 1270 || worldView.top <= 5 || worldView.bottom >= 715) {
			this.camera.pan()
		}
	}

	update() {
		this.updateTimer();
		this.updateVictoryWindowPosition();

		if (this.cursors.left.isDown && !this.hero.body.touching.right) {
			this.hero.left();
		}
		else if (this.cursors.right.isDown && !this.hero.body.touching.left) {
			this.hero.right();
		} 
		else if (!this.hero.onTakeDamage) {
			this.hero.stop();
		}

		if (this.cursors.up.isDown && this.hero.body.touching.down) {
			this.hero.jump(); 
		}

		this.players.forEach((player) =>{
			player.synchronize();
		});

		this.bullets.forEach(bullet => {
			if (bullet.body) {
				bullet.rotation = bullet.body.angle;
			}
		})

		this.camera.worldView
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
