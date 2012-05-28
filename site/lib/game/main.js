ig.module( 
	'game.main' 
)
.requires(
  // system
	'impact.game',
	'impact.font',
	'plugins._plugins',
	
	// levels
	'game.levels.level_01',

  // entities
  'game.entities.player',
  'game.entities.particle',
  'game.entities.vertical',
  'game.entities.vertical-trigger',
  'game.entities.vertical-killer',
  'game.entities.diaganol'
)
.defines(function(){

AttachedToVerticals = ig.Game.extend({

	font: new OutlinedFont('media/outlinedfont.png', 1),
	bigFont: new OutlinedFont('media/outlinedfont_large.png', 1),
	spawnVertical: false,
	verticalTimer: new ig.Timer(),
	modTimer: new ig.Timer(),
	topScore: 0,
	
	
	init: function() {
    ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
    ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
    ig.input.bind( ig.KEY.M, 'molymode' );
    
    this.loadLevel( LevelLevel_01 );
    ig.music.loop = true;
    ig.music.volume = 0.5;
    ig.music.play('main');
	},
	
	loadLevel: function (level) {
    this.parent(level);
    this.player = this.getEntitiesByType(EntityPlayer)[0];    
  },
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		var player = this.player;
		if (player) {
			this.screen.y = player.pos.y - ig.system.height / 5;
			
			if(player.vel.y > 0){
        if(this.spawnVertical){
          if(this.verticalTimer.delta() >= 0){
            this.createVertical();
            this.spawnVertical = false;
          }
        }
        else{
          this.spawnVertical = true;
          var distanceTraveled = player.distanceTraveled;
          var vertSpawnTime = 2;
          if(distanceTraveled < 1000){
            vertSpawnTime = 1.25;
          }
          else if( distanceTraveled < 2000 ){
            vertSpawnTime = 1;
          }
          else if( distanceTraveled < 3000){
            vertSpawnTime = 0.75;
          }
          else if( distanceTraveled < 4000 ){
            verticalTime = 0.5;
          }
          this.verticalTimer.set(vertSpawnTime);
        }
			}
		}
	},
	
	createVertical: function(){
	  var x = ig.system.width * Math.random();
	  var vertical = ig.game.spawnEntity( EntityVertical, x, this.player.pos.y + 200);
    vertical.zIndex = -100;
    // left
    ig.game.spawnEntity( EntityVerticalTrigger, vertical.pos.x - 1, vertical.pos.y, {name: 'left'});
    // right
    ig.game.spawnEntity( EntityVerticalTrigger, vertical.pos.x + vertical.size.x, vertical.pos.y, {name: 'right'});
    // top
    ig.game.spawnEntity( EntityVerticalKiller, vertical.pos.x, vertical.pos.y - 1);
	},
	
	draw: function() {
		this.parent();

		this.font.draw( "Score: " + this.player.score, 6, 20, ig.Font.ALIGN.LEFT );
		var distance = this.player.distanceTraveled,
		  text = distance > this.player.distanceTarget ? distance + "!!1!1" : distance;
		this.font.draw( "Distance: " + text, 6, 30, ig.Font.ALIGN.LEFT );
	}
});

StartScreen = ig.Game.extend({
    instructText: new ig.Font( 'media/04b03.font.png' ),
    background: new ig.Image('media/background.png'),
    font: new OutlinedFont('media/outlinedfont.png', 1),
  	bigFont: new OutlinedFont('media/outlinedfont_large.png', 1),

    init: function() {
        ig.input.bind( ig.KEY.SPACE, 'start');
        this.title = new ig.Sound( 'media/music/ATV-Title.*' );
        var main = new ig.Sound( 'media/music/ATV-Main.*' );
        var mm = ig.music.add( main, 'main' );
        ig.soundManager.volume = 0.4;
        this.title.play();
    },
    
    update: function() {
        if(ig.input.pressed ('start')){
            this.title.stop();
            ig.system.setGame(AttachedToVerticals);
        }
        this.parent();
    },
    
    draw: function() {
        this.parent();
        this.background.draw(0,0);
        var x = 15,
        y = 15;
        yy = ig.system.height - 20;
        this.bigFont.draw( 'Attached\nTo\nVerticals', x, y, ig.Font.ALIGN.LEFT );
        this.font.draw( '#Molyjam2010 \nSource codes: Eddy Parris \nSound waves: Joe Chung \nAwesome sauces: Jo Summers', x, y + 70, ig.Font.ALIGN.LEFT );
        this.font.draw( '> Arrow keys to move left and right \n> Avoid verticals in the face \n> Attach to verticals to slow down \n> Super skillz will engage \n  Moly*eux mode (or hit \'m\')\n> Excuse the bugs', x, y + 125, ig.Font.ALIGN.LEFT );
        this.font.draw( 'Press Spacebar To Start', x, yy, ig.Font.ALIGN.LEFT );
        this.font.draw( 'Press Spacebar To Start', x, yy, ig.Font.ALIGN.LEFT );
        
    }
});

GameOverScreen = ig.Game.extend({
    instructText: new ig.Font( 'media/04b03.font.png' ),
    background: new ig.Image('media/background.png'),
    font: new OutlinedFont('media/outlinedfont.png', 1),
  	bigFont: new OutlinedFont('media/outlinedfont_large.png', 1),
  	greenFont: new OutlinedFont('media/outlinedfont_green_large.png', 1),
  	
    stats: {},
    init: function() {
        ig.input.bind( ig.KEY.SPACE, 'start');
        this.score = ig.score;

        this.dead = new ig.Sound( 'media/music/ATV-Dead.*' );
        ig.soundManager.volume = 0.4;
        this.dead.play();
    },
    
    update: function() {
        if(ig.input.pressed('start')){
            this.dead.stop();
            ig.system.setGame(StartScreen);
        }
        this.parent();
    },
    
    draw: function() {
        this.parent();
        this.background.draw(0,0);
        var x = 15;
        var y = 15;
        var score = this.score;
        this.greenFont.draw('GAME OVER!', x, 20, ig.Font.ALIGN.LEFT);
        this.bigFont.draw('Score: '+score, x, y+25, ig.Font.ALIGN.LEFT);
        this.font.draw('Press Spacebar To Continue.', x, ig.system.height - 20, ig.Font.ALIGN.LEFT);
    }
});

  if(ig.ua.mobile) { // Disable sound for all mobile devices
    ig.Sound.enabled = false;
  }

  var canvas_width = 240, canvas_height = 260;
  ig.main('#canvas', StartScreen, 60, canvas_width, canvas_height, 2);

});

