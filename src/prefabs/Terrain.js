
// You can write more code here

/* START OF COMPILED CODE */

class Terrain extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 343, y ?? 420, texture || "guapen", frame);

		/* START-USER-CTR-CODE */
		this.text = "guapen";
		this.splitImage(4, 4);
		this.tree = Phaser.Structs.RTree();
		this.renderImage(x, y, 4);
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

	checkForAddCollision(id, spritSize){
		let air = false;
		let notAir = 0;
		for(let i = 0; i < spritSize; i++){
			for(let j = 0; j < spritSize; j++){
				let pixel = this.getPixel(i, j, id);
				if(pixel.r === 0 && pixel.g === 0 && pixel.b === 0){
					air = true;
				}
				if(pixel.r !== 0 && pixel.g !== 0 && pixel.b !== 0){
					notAir++;
				}
			}
		}

		return air && notAir;
	}

	renderImage(x, y, splitSize){
		let tex = this.scene.textures.get(this.text).getSourceImage();
		let sizeX = tex.width;
		let width = Math.floor(sizeX / splitSize);
		let count = this.scene.textures.get(this.text).getFrameNames().length;
		for(let i = 0; i < count; i++){
			let pixel = this.getPixel(0, 0, i);

			let sprite = this.scene.add.sprite(Math.floor(i % width) * splitSize + x, Math.floor(i / width) * splitSize + y, this.text, i);
			if(this.checkForAddCollision(i, splitSize)){
				this.scene.physics.add.existing(sprite);
				sprite.body.setAllowGravity(false);
				sprite.body.pushable = false;
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
		let area = this.getCollideArea(rect);
		for(let i = 0; i < area.length; i++){
			area[i].sprite.destroy();
		}
	}

	all(){
		return this.tree.all();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
