(function (app) {
    'use strict';

    const FAKE_DIRECTIONS = {
        'red' : 'up'
    };

    /**
     * Jeu Phaser
     */

    const DEBUG_BODY = true;
    const GAME_WIDTH = 1280;
    const GAME_HEIGHT = 720;

    // Etat actuel du jeu
    app.gameState = function State() {}
    app.gameState.prototype = {
        preload: Preload,
        create: Create,
        update: Update,
        render: Render
    };

    // Instantiation d'un objet Phaser
    app.game = new Phaser.Game(
        GAME_WIDTH,
        GAME_HEIGHT,
        Phaser.AUTO,
        'board',
        app.gameState
    );

    app.game.state.add('game', app.gameState);

    app.game.state.start('game');

    function Preload() {
        app.game.load.spritesheet('player_bas', 'assets/images/player_bas.png', 81, 140, 24);
        app.game.load.spritesheet('player_droite', 'assets/images/player_droite.png', 124, 114, 24);
        app.game.load.spritesheet('player_gauche', 'assets/images/player_gauche.png', 124, 114, 24);
        app.game.load.spritesheet('player_haut', 'assets/images/player_haut.png', 78, 140, 24);

        app.game.load.image('background_level_1', 'assets/images/background_level_1.jpg');
        app.game.load.image('collider', 'assets/images/collider.png');
    }

    function Create() {
        app.game.world.setBounds(0, 0, 1280, 720);
        app.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Chargement de l'image de fond
        app.background = app.game.add.sprite(0, 0, 'background_level_1');

        // Chargement des murs du niveau
        app.walls = app.game.add.group();
        app.walls.enableBody = true;
        app.walls.physicsBodyType = Phaser.Physics.ARCADE;

        let level_1_colliders = [
            [0, 0, 640, 362],
            [804, 0, 477, 720],
            [0, 519, 804, 201]
        ];

        for (let i = 0, wall; i < level_1_colliders.length; i++) {
            wall = app.walls.create(level_1_colliders[i][0], level_1_colliders[i][1], 'collider');
            wall.scale.setTo(level_1_colliders[i][2], level_1_colliders[i][3]);
            wall.body.immovable = true;
        }

        // Chargement des triggers du niveau
        app.triggers = app.game.add.group();
        app.triggers.enableBody = true;
        app.triggers.physicsBodyType = Phaser.Physics.ARCADE;

        let level_1_triggers = [
            [780, 445, 2, 2, 'red'],
            [725, 5, 2, 2, 'destination'],
            
        ];

        for (let i = 0, trigger; i < level_1_triggers.length; i++) {
            trigger = app.triggers.create(level_1_triggers[i][0], level_1_triggers[i][1], 'collider');
            trigger.scale.setTo(level_1_triggers[i][2], level_1_triggers[i][3]);
            trigger.body.immovable = true;
            trigger.color = level_1_triggers[i][4];
        }

        // Chargement du sprite joueur et de ses animations
        app.player = app.game.add.sprite(70, 440, 'player_droite');
        app.player.animations.add('walk');
        app.player.animations.play('walk', 50, true);
        app.player.anchor.x = 0.5;
        app.player.anchor.y = 0.5;
        app.player.speed = 300;
        
        // Activation de la physX
        app.game.physics.arcade.enable(app.player);
        app.player.body.velocity.x = 1 * app.player.speed; // Initial start level velocity
        app.player.body.collideWorldBounds = true;

        app.keys = app.game.input.keyboard.createCursorKeys();

        // Définition des mouvements
        /* app.timeline = app.game.add.tween(app.player).to(
            {
                x : [723, 723],
                y : [442, 0]
            },
        2000);
        app.timeline.start(); */
    }

    function Update() {

        // Collision avec les murs
        app.game.physics.arcade.collide(app.player, app.walls, collidePlayerWalls, null, this);
        if (app.player.body.x <= app.game.world.x ||
            app.player.body.x + app.player.body.width >= app.game.world.width ||
            app.player.body.y <= app.game.world.y ||
            app.player.body.y + app.player.body.height >= app.game.world.height)
        {
            console.warn('touching a world bound !');
            collidePlayerWalls(app.player, null);
        }
        
        // Overlap avec les triggers
        app.game.physics.arcade.overlap(app.player, app.triggers, overlapPlayerTriggers, null, this);

        // app.player.body.velocity.x = 0;
        // app.player.body.velocity.y = 0;

        if (app.neuralDirection === 'up') { // HAUT
            app.player.body.velocity.y = -1 * app.player.speed;

            if (app.player.key !== 'player_haut') {
                app.player.loadTexture('player_haut', 0);
                app.player.animations.add('walk');
                app.player.body.setSize(81, 140);
            }
            
            app.player.animations.play('walk', 50, true);
        }
        else if (app.neuralDirection === 'down') { // BAS
            app.player.body.velocity.y = app.player.speed;

            if (app.player.key !== 'player_bas') {
                app.player.loadTexture('player_bas', 0);
                app.player.animations.add('walk');
                app.player.body.setSize(81, 140);
            }
            
            app.player.animations.play('walk', 50, true);
        }
        else if (app.neuralDirection === 'left') { // GAUCHE
            app.player.body.velocity.x = -1 * app.player.speed;

            if (app.player.key !== 'player_gauche') {
                app.player.loadTexture('player_gauche', 0);
                app.player.animations.add('walk');
                app.player.body.setSize(124, 114);
            }
            
            app.player.animations.play('walk', 50, true);
        }
        else if (app.neuralDirection === 'right') { // DROITE
            app.player.body.velocity.x = app.player.speed;

            if (app.player.key !== 'player_droite') {
                app.player.loadTexture('player_droite', 0);
                app.player.animations.add('walk');
                app.player.body.setSize(124, 114);
            }
            
            app.player.animations.play('walk', 50, true);
        }

        /* if (!app.keys.up.isDown && !app.keys.down.isDown && !app.keys.left.isDown && !app.keys.right.isDown) {
            app.player.animations.stop();
        } */

        app.neuralDirection = false;
    }

    function Render() {
        // app.game.debug.cameraInfo(app.game.camera, 32, 32);
        // app.game.debug.spriteCoords(app.player, 32, 500);
        // app.game.debug.spriteCoords(app.background, 32, 500);

        // app.game.debug.body(app.player);
        // app.game.debug.body(app.background);

        // app.walls.forEach(function (wall) {
        //     app.game.debug.body(wall);
        // });
    }

    function collidePlayerWalls(player, wall) {
        console.warn('COLLISION ! YOU LOOSE');

        app.game.state.restart();
    }

    function overlapPlayerTriggers(player, trigger) {

        if (trigger.color === 'destination') {
            // WIN !!!
            app.game.state.destroy();
            console.info('YOU WIN !');
        }

        app.neuralDirection = FAKE_DIRECTIONS[trigger.color];

        app.player.body.velocity.x = 0;
        app.player.body.velocity.y = 0;

        trigger.kill();
    }

})(window.app);