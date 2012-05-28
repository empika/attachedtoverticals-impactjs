ig.module('game.entities.vertical')
.requires(
    'impact.entity'
)
.defines(function () {

    EntityVertical = ig.Entity.extend({
        size: { x: 4, y: 128 },

        checkAgainst: ig.Entity.TYPE.A,

        type: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.FIXED,
        
        animSheet: new ig.AnimationSheet('media/vertical.png', 4, 128),
    
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim( 'idle', 1, [0] );
            this.currentAnim.flip.x = (Math.random() > 0.5);
        },
    
    });

});