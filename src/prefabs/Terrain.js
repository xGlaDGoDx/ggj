
// You can write more code here

/* START OF COMPILED CODE */

class Terrain extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 343, y ?? 420, texture || "test_platform", frame);

		/* START-USER-CTR-CODE */
		this.text = texture || "test_platform"
		this.splitImage(10, 10);
		this.tree = Phaser.Structs.RTree();
		this.renderImage(x, y, 10);
		this.destroy();
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */


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

	renderImage(x, y, splitSize){
		let tex = this.scene.textures.get(this.text).getSourceImage();
		let sizeX = tex.width;
		let width = Math.floor(sizeX / splitSize);
		let count = this.scene.textures.get(this.text).getFrameNames().length;
		for(let i = 0; i < count; i++){
			let pixel = this.getPixel(0, 0, i);

			if(pixel.r === 0 && pixel.g === 0 && pixel.b === 0){
				continue;
			}
			let sprite = this.scene.physics.add.sprite(Math.floor(i % width) * splitSize + x, Math.floor(i / width) * splitSize + y, this.text, i);
			let bounds = sprite.getBounds();
			this.tree.insert({
				left: bounds.left,
				right: bounds.right,
				top: bounds.top,
				bottom: bounds.bottom,
				sprite: sprite
			});

			sprite.body.setAllowGravity(false);
			sprite.body.pushable = false;
		}
	}

	getCollideArea(rect){
		return this.tree.search(rect);
	}

	destroyArea(rect){
		let area = this.getCollideArea(rect);
		for(let i = 0; i < area.length; i++){
			area[i].sprite.destroy();
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
