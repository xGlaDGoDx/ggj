
// You can write more code here

/* START OF COMPILED CODE */

class Terrain extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 445, y ?? 383, texture || "test_platform", frame);

		/* START-USER-CTR-CODE */
		this.sc = scene;
		
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	createMap(type) {
		this.text = "island" + type;
		this.sc.bg.setTexture("bg" + type);
		this.setTexture(this.text);

		this.splitImage(5, 5);
		this.tree = Phaser.Structs.RTree();

		this.tex = this.scene.textures.get(this.text).getSourceImage();
		this.count = this.scene.textures.get(this.text).getFrameNames().length;

		this.renderImage(this.x, this.y, 5);
		this.destroy();
	}

	splitImage(sizeX, sizeY){
		const tiles = this.scene.textures.get(this.text);
        const base = tiles.get();
		var res = Phaser.Textures.Parsers.SpriteSheet(tiles, base.sourceIndex, base.x, base.y, base.width, base.height, {
            frameWidth: sizeX,
            frameHeight: sizeY
        });
		return res;
	}

	getPixel(x, y, num){
		let color = this.scene.textures.getPixel(x, y, this.text, num);
		return color;
	}

	checkForAddCollision(id, spritSize) {
		let air = false;
		let notAir = false;
		[[0, spritSize - 1], [spritSize-1, 0], [spritSize-1, spritSize-1], [0, 0]].forEach(xy => {
			let pixel = this.getPixel(xy[0], xy[1], id);
			if(!(pixel.r === 0 && pixel.g === 0 && pixel.b === 0)){
				notAir = true;
			} else {
				air = true;
			}
		})

		return air && notAir;
	}


	chechAir(id, splitSize) {
		let air = true;
		[[0, splitSize-1], [splitSize-1, 0], [splitSize-1, splitSize-1], [0, 0]].forEach(xy => {
			let pixel = this.getPixel(xy[0], xy[1], id);
			if(!(pixel.r === 0 && pixel.g === 0 && pixel.b === 0)){
				air = false;
			}
		})

		return air;
	}

	renderImage(x, y, splitSize) {
		let tex = this.tex;
		let sizeX = tex.width;
		let width = Math.floor(sizeX / splitSize);
		let count = this.count;
		for(let i = 0; i < count; i++){
			// let pixel = this.getPixel(0, 0, i);
			if(this.chechAir(i, splitSize)){
				continue;
			}
			//sprite.setVisible(false)
			let sprite = this.scene.add.sprite(Math.floor(i % width) * splitSize + x, Math.floor(i / width) * splitSize + y, this.text, i);
			if(this.checkForAddCollision(i, splitSize)){
				this.scene.physics.add.existing(sprite);
				sprite.body.setAllowGravity(false);
				sprite.body.pushable = false;
				//sprite.body.setEnable(false);
			}
			let bounds = sprite.getBounds();

			this.tree.insert({
				left: bounds.left,
				right: bounds.right,
				top: bounds.top,
				bottom: bounds.bottom,
				sprite: sprite
			});
		}
	}

	getCollideArea(rect){
		return this.tree.search(rect);
	}

	destroyArea(rect){
		let area = this.tree.search(rect);

		let width = rect.maxX - rect.minX;
		let height = rect.maxY - rect.minY;

		let r = Math.max(width, height) / 2;

		let circle = new Phaser.Geom.Circle(rect.x, rect.y, r);

		for(let i = 0; i < area.length; i++){
			if (circle.contains(area[i].sprite.x, area[i].sprite.y)) {
				area[i].sprite.setVisible(false);
				if(area[i].sprite.body) {
					area[i].sprite.body.destroy();
				}
				this.tree.remove(area[i]);
			}
		}
		
		circle.radius = r + 10;
			
		area = this.tree.search({
			minX: rect.minX-10,
			minY: rect.minY-10,
			maxX:rect.maxX+10,
			maxY:rect.maxY+10
		});

		for(let i = 0; i < area.length; i++){
			if (circle.contains(area[i].sprite.x, area[i].sprite.y)) {
				this.sc.physics.add.existing(area[i].sprite);
				area[i].sprite.body.setAllowGravity(false);
				area[i].sprite.body.pushable = false;
			}
		}
	}

	all(){
		return this.tree.all();
	}

	renderTerrain(){

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
