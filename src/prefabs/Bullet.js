class Bullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, velX, velY, power, texture, frame){
        super(scene, x, y, texture, frame);
        this.sc = scene;
        scene.physics.add.existing(this, false);
        let angile = new Phaser.Math.Vector2(this.x - velX, this.y - velY);
        angile.normalize();
        this.setVelocity(angile.x * power, angile.y * power);
        scene.bullets.push(this);
    }

    onCollide(){
        this.sc.terrain.destroyArea({
            minX: this.x - 10,
            minY: this.y - 10,
            maxX: this.x + 10,
            maxY: this.y + 10
        })
        this.destroy();
    }
}