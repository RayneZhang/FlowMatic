import store from '../../store'
import { addObj } from '../../actions'
import * as AFRAME from 'aframe'
import { Vector3 } from 'three'
import { ItemType, itemType } from '../ui/palette-menu';
import { CreateGLTFModel } from '../../utils/SketchFab';

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

            if (itemType == ItemType.Primitive) 
                // Dispatch a task to reducer
                store.dispatch(addObj(this.data.targetModel, position, this.data.color));
            else if (itemType == ItemType.Sketchfab)
                CreateGLTFModel();
        });
    },

    tick: function(time, timeDelta): void {

    }
});