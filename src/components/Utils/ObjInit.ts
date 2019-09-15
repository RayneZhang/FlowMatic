import * as AFRAME from 'aframe';
import { LIGHT } from '../../Objects';

/**
 * This component is used for initializing .obj and .gltf/.glb objects in the scene, such as adding components.
 */
export const objInit = AFRAME.registerComponent('obj-init', {
    schema: {
        name: {type: 'string', default: ""}
    },

    init: function(): void {
        // Most of the objects do not need attaching components
        if (!this.data.name) return;
        switch (this.data.name) {
            case LIGHT: {
                this.el.setAttribute('spotlight', 'color', 'white');
            }
        }
    }
});