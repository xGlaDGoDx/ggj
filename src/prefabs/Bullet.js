class Bullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, velocityX, velocityY, power){
        super(scene, x, y, texture, frame);
        this.scene.phaser.add.existing(this);
        
        this.setVelocity(velocityX * power, velocityY * power);
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.power = power;
    }
}