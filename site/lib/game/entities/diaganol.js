ig.module('game.entities.diaganol')
.requires(
    'impact.entity'
)
.defines(function () {

    EntityDiaganol = ig.Entity.extend({
        size: { x: 192, y: 64 },
    
        animSheet: new ig.AnimationSheet('media/diaganol.png', 192, 64),
    
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim( 'idle', 1, [0] );
        }
    
    });

});