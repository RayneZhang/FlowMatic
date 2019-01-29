declare const THREE:any;

const collisionListener = {
    init: function(): void {
        this.el.addEventListener('hitstart', (event) => {
            this.el.setAttribute('material', {
                transparent: true,
                opacity: 0.5
            });
        });

        this.el.addEventListener('hitend', (event) => {
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