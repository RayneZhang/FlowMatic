declare const THREE:any;

const scaleController = {
    schema: {
        speed: {type: 'number', default: 0.1},
        hand: {type: 'string', default: ''}
    },

    init: function(): void {
        this.scaling = false;
        this.scalePerFr = 1.1;
        this.targetEntity = null;

        const rightHand: any = document.querySelector("#rightHand");
        const listeningEl: any = document.querySelector("#" + this.data.hand + "Hand");
        listeningEl.addEventListener('thumbupstart', (event) => {
            this.targetEntity = rightHand.components['right-grip-listener'].data.grabbedEl;
            if (this.targetEntity && !this.targetEntity.classList.contains('canvasObj')) {
                this.scaling = true;
                this.scalePerFr = 1.01;
            }
        });
        listeningEl.addEventListener('thumbdownstart', (event) => {
            this.targetEntity = rightHand.components['right-grip-listener'].data.grabbedEl;
            if (this.targetEntity && !this.targetEntity.classList.contains('canvasObj')) {
                this.scaling = true;
                this.scalePerFr = 0.99;
            }
        });

        listeningEl.addEventListener('thumbend', (event) => {
            this.scaling = false;
        });
    },

    tick: function(time, timeDelta): void {
        if (this.scaling) {
            this.targetEntity.object3D.scale.x *= this.scalePerFr;
            this.targetEntity.object3D.scale.y *= this.scalePerFr;
            this.targetEntity.object3D.scale.z *= this.scalePerFr;
        }
    }
}

export default scaleController;