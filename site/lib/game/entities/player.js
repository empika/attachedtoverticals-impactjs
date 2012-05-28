ig.module('game.entities.player')
.requires(
    'impact.entity',
    'game.entities.particle',
    'game.entities.molymode'
)
.defines(function () {

    EntityPlayer = ig.Entity.extend({
        size: { x: 14, y: 6 },
        ground_accel: 2000,
        groundVel: 200,
        maxVel: {x: 300, y: 5000},
        friction: {x: 2000, y: 200},
        offset: {x: 1, y: 1},
        flip: false,
        health: 100,
        score: 0,
        addScore: true,
        distanceTraveled: 0,
        distanceTarget: 2000,
        modTimer: new ig.Timer(),
        molyModeEnabled: false,
        
    
        animSheet: new ig.AnimationSheet('media/player.png', 16, 16),
        
        type: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,
    
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim( 'idle', 0.1, [0,1,2,1,0,3,4,3] );
            // 5 is null
            // 6 7 8 9 10 11
            this.addAnim( 'left', 0.2, [6,7,8,9,10,9,8,7] );
            this.addAnim( 'right', 0.2, [13,14,15,16,17,16,15,14] );
            this.addAnim( 'hurt', 0.1, [11,12] );
            this.addAnim( 'cling', 0.2, [18,19,18,19,18,19,20,21,20,21,20,21,20,21,20,21] );
            this.currentAnim = this.anims.idle;
            this.zIndex = 10;
        },

        stopFunction: function(){
          this.accel.x = 0;
        },
        
        update: function(){
          var pos_x = this.pos.x,
            pos_y = this.pos.y,
            size_x = this.size.x,
            size_y = this.size.y,
            ground_accel = this.ground_accel;
          this.parent();
          
          if(pos_x - (size_x / 2) < 0){
        	  this.vel.x = 0;
        	  this.accel.x = 0;
        	  this.pos.x = pos_x + 1;
          }
          else if( pos_x + (size_x * 1.5)  > ig.system.width){
            this.vel.x = 0;
        	  this.accel.x = 0;
        	  this.pos.x = pos_x - 1;
          }
          else{

          	if(ig.input.pressed('left')){
          	  this.flip = false;
          	  this.currentAnim = this.anims.left;
          	}
          	else if(ig.input.pressed('right')){
          	  this.flip = true;
          	  this.currentAnim = this.anims.left;
          	}
          	
          	if( ig.input.state('left') ) {
              this.vel.x = -this.groundVel;
          	}else if( ig.input.state('right') ) {
              this.vel.x = this.groundVel;
          	}
          	else if(Math.round(this.vel.y) > 0){
          	  this.currentAnim = this.anims.idle;
        	  }
            
            if( ig.input.released('left')){
              this.stopFunction();
          	} else if( ig.input.released('right') ) {
              this.stopFunction();
          	}
        	} // end else
        	
        	this.currentAnim.flip.x = this.flip;
        	
      	  if(this.vel.y > 10){
      	    this.addScore = true;
      	  }
      	  
      	  if(this.health <= 0){
      	    ig.score = this.score;
      	    ig.music.stop();
      	    ig.system.setGame(GameOverScreen);
      	  }
      	  
        	if(this.addScore){
        	  var bonus = Math.round((this.distanceTraveled * this.accel.y));
        	  this.score = this.score + bonus;
        	  this.distanceTraveled = this.distanceTraveled + 1;
        	}
        	else{
        	  distanceTraveled = 1;
        	}
        	
        	this.accel.y = 10;
        	if( ig.input.released('molymode')){
        	  this.distanceTraveled = this.distanceTarget;
            this.engageMolyMode();
        	}
        	if( this.distanceTraveled > this.distanceTarget ){
        	    ig.game.spawnEntity( EntityMolyParticle, this.pos.x, this.pos.y - 16 );
            this.engageMolyMode();
        	}
        	else{
        	  this.molyModeEnabled = false;
        	}
        },
        
        engageMolyMode: function(){
          if(ig.game.getEntitiesByType(EntityMolyMode).length == 0 && this.molyModeEnabled === false){
    	      ig.game.spawnEntity( EntityMolyMode, this.pos.x, this.pos.y - 17 );
  	      }
  	      this.molyModeEnabled = true;
        },
        
        draw: function(){
          this.parent();
          ig.system.context.fillStyle = "rgb(0,0,0, 0.5)";
          var width = (ig.system.width * ig.system.scale - 20) * (this.health / 100);
          ig.system.context.fillRect(10, 10, width, 20);
          
        }
    
    });

    EntityMolyParticle = ig.Entity.extend({
    	size: {x: 16, y: 16},
    	offset: {x: 0, y: 0},
    	maxVel: {x: 160, y: 160},
    	minBounceVelocity: 0,
    	vel: {x: 60, y: 100},
    	animSheet: new ig.AnimationSheet( 'media/molydeux.png', 16, 16 ),

    	type: ig.Entity.TYPE.NONE,
    	checkAgainst: ig.Entity.TYPE.NONE,
    	collides: ig.Entity.COLLIDES.LITE,

    	lifetime: 0.5,
    	fadetime: 0.3,
    	bounciness: 0.8,
    	friction: {x:20, y: -0},
    	zIndex: -10,

    	init: function( x, y, settings ) {
        this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
        this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
        this.addAnim( 'idle', 2, [0,1,2,3,4,5,6,7] );
        // this.currentAnim.flip.x = (Math.random() > 0.5);
        // this.currentAnim.flip.y = (Math.random() > 0.5);
        this.currentAnim.gotoRandomFrame();
    		this.idleTimer = new ig.Timer();
    		this.parent( x, y, settings );
    	},

    	update: function() {
    		if( this.idleTimer.delta() > this.lifetime ) {
    			this.kill();
    			return;
    		}
    		this.currentAnim.alpha = this.idleTimer.delta().map(
    			this.lifetime - this.fadetime, this.lifetime,
    			1, 0
    		);
    		this.parent();
    	}
    });

});