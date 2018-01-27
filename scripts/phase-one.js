(function() {
    'use strict';

    const game = new Phaser.Game(1280, 720, Phaser.AUTO, 'board', {
        preload : preload,
        create : create,
        update : update,
        render : render
    });

    let cursors;
    let player;
    let background;

    function preload() {
        game.load.image('player', 'assets/images/ship.png');
        game.load.image('background_level_1', 'assets/images/background_level_1.png');
    }

    function create() {
        game.world.setBounds(0, 0, 1280, 720);
        game.physics.startSystem(Phaser.Physics.P2JS);
        
        background = game.add.sprite(0, 0, 'background_level_1');
        player = game.add.sprite(10, game.world.centerY, 'player');
        cursors = game.input.keyboard.createCursorKeys();

        game.camera.follow(player);
        game.physics.p2.enable(player);
    }

    function update() {
        player.body.setZeroVelocity();
        player.body.velocity.x = 200;

        if (cursors.up.isDown) {
            player.body.moveUp(300);
        }
        else if (cursors.down.isDown) {
            player.body.moveDown(300);
        }

        if (cursors.left.isDown) {
            player.body.velocity.x = -300;
        }
        else if (cursors.right.isDown) {
            player.body.moveRight(300);
        }
    }

    function render() {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
    }

})();