import { loadItems } from '../ui/canvas'
import { googlePoly } from '../../utils/GooglePoly';
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

        const rightHand: any = document.querySelector("#rightHand");
        const listeningEl: any = document.querySelector("#" + this.data.hand + "Hand");
        listeningEl.addEventListener('thumbrightstart', (event) => {
            this.targetEntity = rightHand.components['right-grip-listener'].data.grabbedEl;
            if (this.targetEntity) {
                this.rotating = true;
                this.degPerFr = 1;
            }
        });
        listeningEl.addEventListener('thumbleftstart', (event) => {
            this.targetEntity = rightHand.components['right-grip-listener'].data.grabbedEl;
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
            this.targetEntity.object3D.rotation.y += THREE.MathUtils.degToRad(this.degPerFr * this.data.speed);
        }
    }
}

export default rotationController;