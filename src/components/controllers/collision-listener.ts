declare const THREE:any;

const collisionListener = {
    init: function(): void {
        console.log("Init collision listener.");

        this.el.addEventListener('hitstart', (event) => {
            console.log("Hitstart!");
        });

        this.el.addEventListener('hit', (event) => {
            console.log("Hit!");
        });

        this.el.addEventListener('hitend', (event) => {
            console.log("Hitend!");
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default collisionListener;