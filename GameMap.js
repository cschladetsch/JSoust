
export default class GameMap {
    constructor(scene) {
        this.scene = scene;
        this.platforms = scene.physics.add.staticGroup();
        this.createMap();
    }

    preload() {
        console.log("Preloading platform texture");
        this.scene.load.image('platform', 'assets/platform.png');  // Load from assets folder
    }

    createMap() {
        console.log("Creating platforms...");

        if (!this.scene.textures.exists('platform')) {
            console.error('Platform texture not loaded!');
            return;
        }

        const platformTexture = 'platform';
        const platformScale = 1.5;

        this.platforms.create(400, 568, platformTexture).setScale(2).refreshBody();
        this.platforms.create(600, 400, platformTexture).setScale(platformScale).refreshBody();
        this.platforms.create(50, 250, platformTexture).setScale(platformScale).refreshBody();
        this.platforms.create(750, 220, platformTexture).setScale(platformScale).refreshBody();
    }

    getplatforms() {
        return this.platforms;
    }
}
