export default class EnemyAI {
    constructor(scene, x, y) {
        this.scene = scene;
        this.enemy = scene.physics.add.sprite(x, y, 'enemy');
        this.enemy.setBounce(0.2);
        this.enemy.setCollideWorldBounds(true);
        this.enemy.setGravityY(300);

        this.direction = 1; // 1 for right, -1 for left
        this.changeDirectionTime = 0;
    }

    update(time) {
        // Change direction randomly
        if (time > this.changeDirectionTime) {
            this.direction = Math.random() < 0.5 ? -1 : 1;
            this.changeDirectionTime = time + Phaser.Math.Between(2000, 5000);
        }

        // Move horizontally
        this.enemy.setVelocityX(100 * this.direction);  // Faster horizontal movement

        // Random flapping with a slight boost if near player
        const playerPosition = this.scene.player.sprite.body.position;
        const enemyPosition = this.enemy.body.position;
        const distance = Phaser.Math.Distance.Between(playerPosition.x, playerPosition.y, enemyPosition.x, enemyPosition.y);

        if (distance < 200 || Math.random() < 0.05) {
            this.enemy.setVelocityY(-250);  // Flap more aggressively if near player
        }

        // Gradual slowdown (air resistance)
        this.enemy.setVelocityY(this.enemy.body.velocity.y * 0.98);
    }

    handleCollision(player) {
        const enemyTop = this.enemy.body.top;
        const playerBottom = player.body.bottom;

        if (playerBottom < enemyTop + 10) { // Player is above the enemy
            return 'killEnemy';
        } else {
            return 'killPlayer';
        }
    }
}
