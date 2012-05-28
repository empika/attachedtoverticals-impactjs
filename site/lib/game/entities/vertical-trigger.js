ig.module('game.entities.vertical-trigger')
.requires(
    'impact.entity'
)
.defines(function () {

    EntityVerticalTrigger = ig.Entity.extend({

        _wmScalable: false,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(196, 255, 0, 0.7)',
        size: {x: 1, y: 120},
        checkAgainst: ig.Entity.TYPE.A,
        timer: new ig.Timer(),
        attached: false,

        type: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.FIXED,

        check: function(other){
              
          // Check if we got a "door" entity with the given name
          if( other && other instanceof EntityPlayer ) {
            
            if( this.attached == false){
              this.attached = true;
              this.timer.set( 2 );
              this.name == "left" ? other.flip = true : other.flip = false;
              other.currentAnim = other.anims.cling.rewind();
              other.molyModeEnabled = false;
              other.distanceTraveled = 0;
            }
            else{
              if(this.timer.delta() < 0){
                other.accel.x = 0;
                other.accel.y = 0;
                other.vel.x = 0;
                other.vel.y = 0;
                other.addScore = false;
                other.currentAnim = other.anims.cling;
                other.distanceTraveled = 0;
              }
              else{
                this.attached = false;
                this.kill();
                other.currentAnim = other.anims.idle;
                other.addScore = true;
              }
            }
          }
        }

    });

});