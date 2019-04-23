declare const THREE:any;

const collisionListener = {
    init: function(): void {
        this.el.addEventListener('hitstart', (event) => {
            console.log("Collide!!!");
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