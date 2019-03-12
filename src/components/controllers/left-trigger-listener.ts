import store from '../../store'
import { addObject } from '../../actions'

declare const THREE:any;

const leftTriggerListener = {
    schema: {
        triggering: {type: 'boolean', default: false},
        targetModel: {type: 'string', default: ''},
        color: {type: 'string', default: ''}
    },

    init: function(): void {
        
        this.id = 0;
        const el = this.el;
        const listeningEl = document.querySelector('#leftHand');

        listeningEl.addEventListener('triggerdown', (event) => {  
            // Add position component to the entity.
            const controllerPos: any = el.object3D.position;
            const cameraRig: any = document.querySelector("#cameraRig");
            const position = new THREE.Vector3(cameraRig.object3D.position.x + controllerPos.x, cameraRig.object3D.position.y + controllerPos.y, cameraRig.object3D.position.z + controllerPos.z);

            store.dispatch(addObject(this.id, this.data.targetModel, position, this.data.color));
            this.id++;
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default leftTriggerListener;