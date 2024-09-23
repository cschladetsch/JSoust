
export default class JoustScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JoustScene' });
    }

    preload() {
        // Load all assets from the assets folder
        this.load.image('platform', 'assets/platform.png');
        this.load.image('player', 'assets/player_character.png');
        this.load.image('enemy', 'assets/enemy_sprite.png');
    }

    create() {
        // First, create the map and player
        this.map = new GameMap(this);
        this.player = new Player(this, 100, 450);  // Ensure player is fully initialized before enemy creation

        // Now create the enemies, after player has been created
        this.enemies = [];
        this.enemies.push(new EnemyAI(this, 500, 300, this.player));  // Pass the player object correctly to enemy AI
    }

    update() {
        this.player.update();
        this.enemies.forEach(enemy => enemy.update());
    }
}
