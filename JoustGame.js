import Phaser from 'phaser';
import EnemyAI from './EnemyAI.js';
import GameMap from './GameMap.js';
import Player from './Player.js';

class JoustScene extends Phaser.Scene {
    constructor() {
        super('JoustScene');
    }

    preload() {
        // We don't need to preload SVG files anymore
    }

    create() {
        this.gameMap = new GameMap(this);
        
        // Create player shape
        let playerShape = this.make.graphics({ x: 0, y: 0, add: false });
        playerShape.fillStyle(0x0000ff);
        playerShape.fillCircle(25, 25, 20);
        playerShape.fillStyle(0xffff00);
        playerShape.fillTriangle(25, 5, 10, 25, 40, 25);
        playerShape.generateTexture('player', 50, 50);

        // Create enemy shape
        let enemyShape = this.make.graphics({ x: 0, y: 0, add: false });
        enemyShape.fillStyle(0xff0000);
        enemyShape.fillCircle(25, 25, 20);
        enemyShape.fillStyle(0xffa500);
        enemyShape.fillTriangle(10, 25, 40, 25, 25, 5);
        enemyShape.generateTexture('enemy', 50, 50);

        this.player = new Player(this, 100, 450);

        this.enemies = [];
        for (let i = 0; i < 3; i++) {
            this.enemies.push(new EnemyAI(this, Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500)));
        }

        this.physics.add.collider(this.player.sprite, this.gameMap.getplatforms());
        this.enemies.forEach(enemy => {
            this.physics.add.collider(enemy.enemy, this.gameMap.getplatforms());
            this.physics.add.overlap(this.player.sprite, enemy.enemy, this.handlePlayerEnemyCollision, null, this);
        });

        // Scoring system
        this.score = 0;
        this.lives = 3;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        this.livesText = this.add.text(16, 50, 'Lives: 3', { fontSize: '32px', fill: '#fff' });

        // Game over text
        this.gameOverText = this.add.text(400, 300, '', { fontSize: '64px', fill: '#fff' });
        this.gameOverText.setOrigin(0.5);

        // Restart key
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update(time, delta) {
        if (this.lives > 0) {
            this.player.update();
            this.enemies.forEach(enemy => enemy.update(time));
        }

        if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
            this.scene.restart();
        }
    }

    handlePlayerEnemyCollision(playerSprite, enemySprite) {
        const enemy = this.enemies.find(e => e.enemy === enemySprite);
        if (enemy) {
            const result = enemy.handleCollision(playerSprite);

            if (result === 'killEnemy') {
                enemySprite.disableBody(true, true);
                this.score += 100;
                this.scoreText.setText('Score: ' + this.score);
                
                // Remove the enemy from the array
                this.enemies = this.enemies.filter(e => e.enemy !== enemySprite);
                
                // Spawn a new enemy
                const newEnemy = new EnemyAI(this, Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500));
                this.enemies.push(newEnemy);
                this.physics.add.collider(newEnemy.enemy, this.gameMap.getplatforms());
                this.physics.add.overlap(this.player.sprite, newEnemy.enemy, this.handlePlayerEnemyCollision, null, this);
            } else if (result === 'killPlayer') {
                this.lives--;
                this.livesText.setText('Lives: ' + this.lives);

                if (this.lives <= 0) {
                    this.physics.pause();
                    playerSprite.setTint(0xff0000);
                    this.gameOverText.setText('Game Over\nPress ESC to restart');
                } else {
                    // Respawn player
                    playerSprite.setPosition(100, 450);
                }
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [JoustScene]
};

const game = new Phaser.Game(config);
