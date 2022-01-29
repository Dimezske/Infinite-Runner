import Phaser from '../lib/phaser.js'

export default class Player extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.acceleration = 600;
        this.body.maxVelocity.x = 200;
        this.body.maxVelocity.y = 500;
        this.animSuffix = '';
        this.small();

        this.bending = false;
        this.wasHurt = -1;
        this.flashToggle = false;
        this.star = {
            active: false,
            timer: -1,
            step: 0
        };
        //this.enteringPipe = false;
        this.anims.play('stand');
        this.alive = true;
        this.type = 'player';
        this.jumpTimer = 0;
        this.jumping = false;
        //this.fireCoolDown = 0;

        this.on('animationcomplete', () => {
            if (this.anims.currentAnim.key === 'grow' || this.anims.currentAnim.key === 'shrink') {
                this.scene.physics.world.resume();
            }
        }, this);
    }
    update(keys, time, delta) {
        if (this.y > 2040) {
            // Really superdead, has been falling for a while.
            this.scene.scene.start('TitleScene');

            // If Mario falls down a cliff or died, just let him drop from the sky and prentend like nothing happened
            // this.y = -32;
            // if(this.x<16){
            //   this.x = 16;
            // }
            // this.alive = true;
            // this.scene.music.seek = 0;
            // this.scene.music.play();
        } else if (this.y > 240 && this.alive) {
            this.die();
        }

        if (this.body.velocity.y < 0 || this.bending) {
            this.scene.physics.world.collide(this, this.scene.groundLayer, this.scene.tileCollision);
        } else {
            this.scene.physics.world.collide(this, this.scene.groundLayer);
        }

        if (this.wasHurt > 0) {
            this.wasHurt -= delta;
            this.flashToggle = !this.flashToggle;
            this.alpha = this.flashToggle ? 0.2 : 1;
            if (this.wasHurt <= 0) {
                this.alpha = 1;
            }
        }

        let input = {
            left: keys.left.isDown || this.scene.touchControls.left,
            right: keys.right.isDown || this.scene.touchControls.right,
            down: keys.down.isDown || this.scene.touchControls.down,
            jump: keys.jump.isDown || keys.jump2.isDown || this.scene.touchControls.jump,
            fire: keys.fire.isDown
        };

        if (this.body.velocity.y > 0) {
            this.hasFalled = true;
        }

        this.bending = false;

        this.jumpTimer -= delta;

        if (input.left) {
            if (this.body.velocity.y === 0) {
                this.run(-this.acceleration);
            } else {
                this.run(-this.acceleration / 3);
            }
            this.flipX = true;
        } else if (input.right) {
            if (this.body.velocity.y === 0) {
                this.run(this.acceleration);
            } else {
                this.run(this.acceleration / 3);
            }
            this.flipX = false;
        } else if (this.body.blocked.down) {
            if (Math.abs(this.body.velocity.x) < 10) {
                this.body.setVelocityX(0);
                this.run(0);
            } else {
                this.run(((this.body.velocity.x > 0) ? -1 : 1) * this.acceleration / 2);
            }
        } else if (!this.body.blocked.down) {
            this.run(0);
        }

        if (input.jump && (!this.jumping || this.jumpTimer > 0)) {
            this.jump();
        } else if (!input.jump) {
            this.jumpTimer = -1; // Don't resume jump if button is released, prevents mini double-jumps
            if (this.body.blocked.down) {
                this.jumping = false;
            }
        }

        let anim = null;
        if (this.body.velocity.y !== 0) {
            anim = 'jump';
        } else if (this.body.velocity.x !== 0) {
            anim = 'run';
            if ((input.left || input.right) && ((this.body.velocity.x > 0 && this.body.acceleration.x < 0) || (this.body.velocity.x < 0 && this.body.acceleration.x > 0))) {
                anim = 'turn';
            } else if (this.animSuffix !== '' && input.down && !(input.right || input.left)) {
                anim = 'bend';
            }
        } else {
            anim = 'stand';
            if (this.animSuffix !== '' && input.down && !(input.right || input.left)) {
                anim = 'bend';
            }
        }

        anim += this.animSuffix;
        if (this.anims.currentAnim.key !== anim && !this.scene.physics.world.isPaused) {
            this.anims.play(anim);
        }

        if (input.down && this.body.velocity.x < 100) {
            this.bending = true;
        }

        this.physicsCheck = true;
    }

    run(vel) {
        this.body.setAccelerationX(vel);
    }

    jump() {
        if (!this.body.blocked.down && !this.jumping) {
            return;
        }

        if (!this.jumping) {
            if (this.animSuffix === '') {
                this.scene.sound.playAudioSprite('sfx', 'smb_jump-small');
            } else {
                this.scene.sound.playAudioSprite('sfx', 'smb_jump-super');
            }
        }
        if (this.body.velocity.y < 0 || this.body.blocked.down) {
            this.body.setVelocityY(-200);
        }
        if (!this.jumping) {
            this.jumpTimer = 300;
        }
        this.jumping = true;
    }

    die() {
        this.scene.music.pause();
        this.play('death');
        this.scene.sound.playAudioSprite('sfx', 'smb_mariodie');
        this.body.setAcceleration(0);
        this.body.setVelocity(0, -300);
        this.alive = false;
    }

    setRoomBounds(rooms) {
        rooms.forEach(
            (room) => {
                if (this.x >= room.x && this.x <= (room.x + room.width)) {
                    let cam = this.scene.cameras.main;
                    let layer = this.scene.groundLayer;
                    cam.setBounds(room.x, 0, room.width * layer.scaleX, layer.height * layer.scaleY);
                    this.scene.finishLine.active = (room.x === 0);
                    this.scene.cameras.main.setBackgroundColor(room.sky);
                }
            }
        );
    }

}
