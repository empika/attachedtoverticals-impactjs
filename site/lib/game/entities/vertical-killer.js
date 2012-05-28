ig.module('game.entities.vertical-killer')
.requires(
    'impact.entity',
    'game.entities.particle'
)
.defines(function () {

    EntityVerticalKiller = ig.Entity.extend({
        
        _wmScalable: false,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(196, 255, 0, 0.7)',
        size: {x: 6, y: 1},
        checkAgainst: ig.Entity.TYPE.A,
        timer: new ig.Timer(),

        type: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.FIXED,

        check: function(other){              
          if( other && other instanceof EntityPlayer ) {
            var side = Math.random() > 0.5 ? other.pos.x  - 1 : other.pos.x + other.size.x + 1;
            ig.game.spawnEntity( EntityBludParticle, side, other.pos.y + other.size.y + 1 );
            other.distanceTraveled = 0;
            other.health = other.health - 1;
            other.currentAnim = other.anims.hurt;
          }
        }
    });



  EntityBludParticle = EntityParticle.extend({
  	lifetime: 3,
  	fadetime: 1,
  	bounciness: 0.8,
  	vel: {x: 60, y: 20},
	
  	animSheet: new ig.AnimationSheet( 'media/blud.png', 2, 2 ),
		
  	init: function( x, y, settings ) {
  		this.addAnim( 'idle', 0.5, [0,1,2,3,4]);//[0,1,2,3,4,5,6,7] );		
  		this.parent( x, y, settings );
  	}
  });

});