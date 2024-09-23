
export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        this.sprite.setBounce(0.2);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setGravityY(300);

        // Custom physics values for smoother flight
        this.acceleration = 300;
        this.maxVelocity = 400;
        this.deceleration = 0.98;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.flapKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    preload() {
        this.scene.load.image('player', 'assets/player_character.png');  // Load the new player sprite
    }

    update() {
        console.log("Player is being updated");
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(160);
        } else {
            this.sprite.setVelocityX(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.flapKey)) {
            this.sprite.setVelocityY(Math.max(this.sprite.body.velocity.y - this.acceleration, -this.maxVelocity));
        }

        this.sprite.setVelocityY(this.sprite.body.velocity.y * this.deceleration);
    }
}
