declare const THREE:any;

const collisionListener = {
    init: function(): void {
        this.el.addEventListener('hitstart', (event) => {
            console.log("Hit started!");
            this.el.setAttribute('material', {
                transparent: true,
                opacity: 0.2
            });
        });

        this.el.addEventListener('hitend', (event) => {
            console.log("Hit ended!");
            this.el.setAttribute('material', {
                transparent: false,
                opacity: 1
            });
        });        
    },

    tick: function(time, timeDelta): void {

    }
}

export default collisionListener;