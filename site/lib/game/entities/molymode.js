ig.module('game.entities.molymode')
.requires(
    'impact.entity'
)
.defines(function () {

    EntityMolyMode = ig.Entity.extend({
        lifetime: 3,
      	fadetime: 1,
      	modTimer: new ig.Timer(),
      	bigFont: new OutlinedFont('media/outlinedfont_large.png', 1),
      	alpha: 1,
      	
        init: function (x, y, settings) {
          this.idleTimer = new ig.Timer();
          this.parent(x, y, settings);
        },
        
        update: function(){
          this.parent();
      		if( this.idleTimer.delta() > this.lifetime ) {
      			this.kill();
      			return;
      		}
        },
        
        draw: function(){
          this.alpha = this.idleTimer.delta().map(
      			this.lifetime - this.fadetime, this.lifetime,
      			1, 0
      		);
          ig.system.context.globalAlpha = this.alpha;
          if(Math.round(this.modTimer.delta() * 10) % 2){
            this.bigFont.draw( "ENGAGE \nMOLY*NEUX MODE!", ig.system.width / 2, ig.system.height / 2, ig.Font.ALIGN.CENTER);
          }
          ig.system.context.globalAlpha = 1;
          
        }
    
    });

});