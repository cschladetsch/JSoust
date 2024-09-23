export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        this.sprite.setBounce(0.2);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setGravityY(300);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.flapKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(160);
        } else {
            this.sprite.setVelocityX(0);
        }

        // Acceleration and smooth deceleration for flight
        const flightSpeed = 300;
        const deceleration = 0.98;
        const maxVelocity = 400;

        if (Phaser.Input.Keyboard.JustDown(this.flapKey)) {
            this.sprite.setVelocityY(Math.max(this.sprite.body.velocity.y - flightSpeed, -maxVelocity));
        }

        this.sprite.setVelocityY(this.sprite.body.velocity.y * deceleration);
    }
}
