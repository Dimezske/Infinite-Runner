//import Phaser from '../lib/phaser.js'
export default function makeAnimations(scene) {
    // TONS of animations. Everything animation-related is ugly and stupid below.
    // TODO:  maybe use JSON to load animations
    
    //---------------Player Animation------------------------------
    let config = {
        key: 'left',
        frames: scene.anims.generateFrameNumbers('player', { start: 1, end: 3 }),
        frameRate: 10,
        repeat: -1
        })
    };
    let config = {
        key: 'turn',
        frames: [ { key: 'player', frame: 0 } ],
        frameRate: 20
        })
    };
    let config = {
        key: 'turn',
        frames: [ { key: 'player', frame: 0 } ],
        frameRate: 20
        })
    };
    let config = {
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
        frameRate: 10,
        repeat: -1
        })
    };
    let config = {
        key: 'clingleft',
        frames: [ { key: 'player', frame: 10 } ],
        frameRate: 20
        })
    };
    let config = {
        key: 'clingright',
        frames: [ { key: 'player', frame: 11 } ],
        frameRate: 20
        })
    };

    
}