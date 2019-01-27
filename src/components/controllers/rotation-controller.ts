declare const THREE:any;

const rotationController = {
    schema: {
        speed: {type: 'number', default: 1},
        hand: {type: 'string', default: ''}
    },

    init: function(): void {
        this.rotating = false;
        this.degPerFr = 0.15;
        this.targetEntity = null;

        const rightHandInfo: any = document.querySelector("#rightHandInfo");
        const listeningEl: any = document.querySelector("#" + this.data.hand + "Hand");
        listeningEl.addEventListener('thumbrightstart', (event) => {
            this.targetEntity = rightHandInfo.components['right-trigger-listener'].data.selectedEl;
            if (this.targetEntity) {
                this.rotating = true;
                this.degPerFr = 1;
            }
        });
        listeningEl.addEventListener('thumbleftstart', (event) => {
            this.targetEntity = rightHandInfo.components['right-trigger-listener'].data.selectedEl;
            if (this.targetEntity) {
                this.rotating = true;
                this.degPerFr = -1;
            }
        });

        listeningEl.addEventListener('thumbend', (event) => {
            this.rotating = false;
        });
    },

    tick: function(time, timeDelta): void {
        if (this.rotating) {
            this.targetEntity.object3D.rotation.y += THREE.Math.degToRad(this.degPerFr * this.data.speed);
        }
    }
}

export default rotationController;