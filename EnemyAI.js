
export default class EnemyAI {
    constructor(scene, x, y, player) {
        this.scene = scene;
        this.player = player;
        this.enemy = scene.physics.add.sprite(x, y, 'enemy');
        this.enemy.setBounce(0.2);
        this.enemy.setCollideWorldBounds(true);
        this.enemy.setGravityY(300);

        this.state = 'patrol';  // Initial state for state machine
        this.evasionSkill = parseFloat(localStorage.getItem('successRate')) || 0.5;  // Persistent learning rate
        
        this.direction = 1; 
        this.changeDirectionTime = 0;

        this.spawnAwayFromPlayer();
    }

    preload() {
        console.log("Preloading enemy texture");
        this.scene.load.image('enemy', 'assets/enemy_sprite.png');  // Load the new enemy sprite
    }

    spawnAwayFromPlayer() {
        const playerX = this.player.sprite.body.x;
        if (Math.random() < 0.5) {
            this.enemy.x = playerX + 500;
        } else {
            this.enemy.x = playerX - 500;
        }
        this.enemy.setX(Phaser.Math.Clamp(this.enemy.x, 0, this.scene.scale.width));
    }

    update(time) {
        console.log("Enemy AI is updating");
        switch (this.state) {
            case 'patrol':
                this.patrol(time);
                if (this.isPlayerNearby()) {
                    this.state = 'attack';
                }
                break;

            case 'attack':
                this.attackPlayer();
                if (this.shouldEvade()) {
                    this.state = 'evade';
                }
                break;

            case 'evade':
                this.evadePlayer();
                if (this.isPlayerFar()) {
                    this.state = 'patrol';
                }
                break;
        }
    }

    patrol(time) {
        if (time > this.changeDirectionTime) {
            this.direction = Math.random() < 0.5 ? -1 : 1;
            this.changeDirectionTime = time + Phaser.Math.Between(2000, 5000);
        }
        this.enemy.setVelocityX(50 * this.direction);
    }

    attackPlayer() {
        const playerPos = this.player.sprite.body.position;
        const enemyPos = this.enemy.body.position;
        this.enemy.setVelocityX(playerPos.x > enemyPos.x ? 100 : -100);
        if (Math.random() < 0.05 || this.distanceToPlayer() < 150) {
            this.enemy.setVelocityY(-250);
        }
    }

    evadePlayer() {
        const playerPos = this.player.sprite.body.position;
        const enemyPos = this.enemy.body.position;
        this.enemy.setVelocityX(playerPos.x > enemyPos.x ? -150 : 150);
        if (Math.random() < 0.05 || this.distanceToPlayer() > 200) {
            this.enemy.setVelocityY(-250);
        }
    }

    isPlayerNearby() {
        return this.distanceToPlayer() < 200;
    }

    isPlayerFar() {
        return this.distanceToPlayer() > 300;
    }

    distanceToPlayer() {
        const playerPos = this.player.sprite.body.position;
        const enemyPos = this.enemy.body.position;
        return Phaser.Math.Distance.Between(playerPos.x, playerPos.y, enemyPos.x, enemyPos.y);
    }

    shouldEvade() {
        return Math.random() > this.evasionSkill;
    }

    learnFromDefeat() {
        this.evasionSkill = Math.min(1, this.evasionSkill + 0.1);
        localStorage.setItem('successRate', this.evasionSkill);
    }
}
