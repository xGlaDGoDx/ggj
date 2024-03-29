class Bullet extends spine.SpineGameObject {
    constructor(scene, plugin, x, y, velX, velY, power, boundsProvider) {
        let angile = new Phaser.Math.Vector2(velX - x, velY - y);
        angile.normalize();

        super(scene, plugin, x + angile.x * 30, y + angile.y * 30, "rocket", "rocket-atlas", boundsProvider ?? new spine.SkinsAndAnimationBoundsProvider(null, ["default"]));

        this.skeleton.setSkinByName("default");
        // this.animationState.setAnimation(0, "start", false);
        this.sc = scene;
        scene.physics.add.existing(this, false);


        this.body.setVelocity(angile.x * power, angile.y * power);
        scene.bullets.push(this);
        this.index = scene.bullets.length - 1;

       setTimeout(this.delete.bind(this), 7000);
    }

    onCollide(){
        let expSound = this.scene.sound.add('взрыв');
        expSound.play();
        new Explosion(this.scene, this.x, this.y);
        let explosionArea = {
            x: this.x,
            y: this.y,
            minX: this.x - 70,
            minY: this.y - 70,
            maxX: this.x + 70,
            maxY: this.y + 70
        }

        this.sc.onExplosion(explosionArea);
        this.delete();
    }

    delete() {
        this.destroy();
        this.isExplosion = true;
        this.sc.bullets.splice(this.index, 1);
    }
}