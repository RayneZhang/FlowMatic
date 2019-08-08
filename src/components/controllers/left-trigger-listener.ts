import store from '../../store'
import { addObj } from '../../actions'
import { scene } from '../../index'
declare const THREE:any;

const leftTriggerListener = {
    schema: {
        targetModel: {type: 'string', default: ''},
        color: {type: 'string', default: ''}
    },

    init: function(): void {
        this.el.addEventListener('triggerdown', (event) => {  
            // Add position component to the entity.
            const controllerPos: any = this.el.object3D.position;
            const cameraRig: any = document.querySelector("#cameraRig");
            const position = new THREE.Vector3(cameraRig.object3D.position.x + controllerPos.x, cameraRig.object3D.position.y + controllerPos.y, cameraRig.object3D.position.z + controllerPos.z);

            // Dispatch a task to reducer
            store.dispatch(addObj(this.data.targetModel, position, this.data.color));
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default leftTriggerListener;