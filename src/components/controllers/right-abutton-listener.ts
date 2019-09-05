import store from '../../store'
import { addObj } from '../../actions'
import * as AFRAME from 'aframe'
import { Vector3 } from 'three'
declare const THREE:any;

export const rightAButtonListener = AFRAME.registerComponent('right-abutton-listener', {
    schema: {
        targetModel: {type: 'string', default: ''},
        color: {type: 'string', default: ''}
    },

    init: function(): void {
        this.el.addEventListener('abuttondown', (event) => {  
            // Add position component to the entity.
            this.el.object3D.updateMatrix();
            this.el.object3D.updateMatrixWorld();
            const position = this.el.object3D.localToWorld(new Vector3(0, -0.4, -0.5));

            // Dispatch a task to reducer
            store.dispatch(addObj(this.data.targetModel, position, this.data.color));
        });
    },

    tick: function(time, timeDelta): void {

    }
});