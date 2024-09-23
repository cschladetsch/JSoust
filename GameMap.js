export default class GameMap {
    constructor(scene) {
        this.scene = scene;
        this.platforms = scene.physics.add.staticGroup();
        this.createMap();
    }

    createMap() {
        // Create ground
        this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();

        // Create some platforms
        this.platforms.create(600, 400, 'platform');
        this.platforms.create(50, 250, 'platform');
        this.platforms.create(750, 220, 'platform');
    }

    getplatforms() {
        return this.platforms;
    }
}
