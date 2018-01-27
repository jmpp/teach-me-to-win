(function() {
    'use strict';

    const DEBUG_BODY = true;
    const GAME_WIDTH = 1280;
    const GAME_HEIGHT = 720;

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
        game.load.physics('level_1', 'assets/levels/level_1.json');
    }

    function create() {
        game.world.setBounds(0, 0, 1280, 720);
        game.physics.startSystem(Phaser.Physics.P2JS);
        
        background = game.add.sprite(0, 0, 'background_level_1');
        player = game.add.sprite(10, game.world.centerY, 'player');
        cursors = game.input.keyboard.createCursorKeys();

        game.camera.follow(player);
        game.physics.p2.enable([player, background], DEBUG_BODY);
        
        background.body.static = true;
        background.body.clearShapes();
        background.body.loadPolygon('level_1', 'background_level_1');
    }

    function update() {
        background.body.x = GAME_WIDTH * 0.5;
        background.body.y = GAME_HEIGHT * 0.5;

        player.body.setZeroVelocity();
        player.body.velocity.x += 5;

        if (cursors.up.isDown) {
            player.body.moveUp(300);
            player.body.angle = -90;
        }
        else if (cursors.down.isDown) {
            player.body.moveDown(300);
            player.body.angle = 90;
        }

        if (cursors.left.isDown) {
            player.body.moveLeft(300);
            player.body.angle = 180;
        }
        else if (cursors.right.isDown) {
            player.body.moveRight(300);
            player.body.angle = 0;
        }
    }

    function render() {
        game.debug.cameraInfo(game.camera, 32, 32);
        // game.debug.spriteCoords(player, 32, 500);
        game.debug.spriteCoords(background, 32, 500);

        game.debug.body(player);
        game.debug.body(background);
    }

})();