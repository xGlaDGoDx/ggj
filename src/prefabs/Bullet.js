class Bullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, velX, velY, power, texture, frame){
        let angile = new Phaser.Math.Vector2(velX - x, velY - y);
        angile.normalize();

        super(scene, x + angile.x * 30, y + angile.y * 30, texture, frame);
        this.sc = scene;
        scene.physics.add.existing(this, false);
       
        this.setVelocity(angile.x * power, angile.y * power);
        scene.bullets.push(this);
    }

    onCollide(){
        this.sc.terrain.destroyArea({
            minX: this.x - 80,
            minY: this.y - 80,
            maxX: this.x + 80,
            maxY: this.y + 80
        })
        this.destroy();
    }
}