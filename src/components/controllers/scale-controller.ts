declare const THREE:any;

const scaleController = {
    schema: {
        speed: {type: 'number', default: 1},
        hand: {type: 'string', default: ''}
    },

    init: function(): void {
        this.scaling = false;
        this.scalePerFr = 0.025;
        this.targetEntity = null;

        const rightHandInfo: any = document.querySelector("#rightHandInfo");
        const listeningEl: any = document.querySelector("#" + this.data.hand + "Hand");
        listeningEl.addEventListener('thumbupstart', (event) => {
            this.targetEntity = rightHandInfo.components['right-trigger-listener'].data.selectedEl;
            if (this.targetEntity) {
                this.scaling = true;
                this.scalePerFr = 0.025;
            }
        });
        listeningEl.addEventListener('thumbdownstart', (event) => {
            this.targetEntity = rightHandInfo.components['right-trigger-listener'].data.selectedEl;
            if (this.targetEntity) {
                this.scaling = true;
                this.scalePerFr = -0.025;
            }
        });

        listeningEl.addEventListener('thumbend', (event) => {
            this.scaling = false;
        });
    },

    tick: function(time, timeDelta): void {
        if (this.scaling) {
            this.targetEntity.object3D.scale.x += this.scalePerFr * this.data.speed;
            this.targetEntity.object3D.scale.y += this.scalePerFr * this.data.speed;
            this.targetEntity.object3D.scale.z += this.scalePerFr * this.data.speed;
        }
    }
}

export default scaleController;