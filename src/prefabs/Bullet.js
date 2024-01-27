class Bullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, velX, velY, power, texture, frame){
        let angile = new Phaser.Math.Vector2(velX - this.x, velY - this.y);
        angile.normalize();

        super(scene, x, y, texture, frame);
        this.sc = scene;
        scene.physics.add.existing(this, false);
       
        this.setVelocity(angile.x * power, angile.y * power);
        scene.bullets.push(this);
    }

    onCollide(){
        console.log(this.x, this.y);
        this.sc.terrain.destroyArea({
            minX: this.x - 80,
            minY: this.y - 80,
            maxX: this.x + 80,
            maxY: this.y + 80
        })
        this.destroy();
    }
}