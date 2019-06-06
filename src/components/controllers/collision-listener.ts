declare const THREE:any;

const collisionListener = {
    init: function(): void {
        this.el.addEventListener('hitstart', (event) => {
            event.stopPropagation();
            console.log("Hit started!" + this.el.getAttribute('id'));
            this.el.setAttribute('material', {
                transparent: true,
                opacity: 0.2
            });
        });

        this.el.addEventListener('hitend', (event) => {
            event.stopPropagation();
            console.log("Hit ended!" + this.el.getAttribute('id'));
            this.el.setAttribute('material', {
                transparent: false,
                opacity: 1
            });
        });  
        
        this.el.addEventListener('collide', (event) => {
            event.stopPropagation();
            console.log("Collide started!" + this.el.getAttribute('id'));
            // this.el.setAttribute('material', {
            //     transparent: true,
            //     opacity: 0.2
            // });
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default collisionListener;