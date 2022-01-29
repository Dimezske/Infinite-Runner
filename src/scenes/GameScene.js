import Phaser from '../lib/phaser.js'
import Player from '../game/player.js'


export default class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() 
    {
        //this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    }

    create()
    {

    }

    update()
    {

    }
}