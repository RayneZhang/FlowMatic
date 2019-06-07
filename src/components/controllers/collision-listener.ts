declare const THREE:any;

const collisionListener = {
    init: function(): void {
        this.el.addEventListener('collide', (event) => {
            console.log("Collide started!" + this.el.getAttribute('id'));

            this.el.setAttribute('material', {
                transparent: true,
                opacity: 0.2
            });
        });

        this.el.addEventListener('collisions', (event) => {
            console.log("Collisions started!" + this.el.getAttribute('id'));

            this.el.setAttribute('material', {
                transparent: true,
                opacity: 0.2
            });
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default collisionListener;