import * as AFRAME from 'aframe'
import { Vector3 } from 'three'

const interval: number = 0.1;

export const typeConstraint = AFRAME.registerComponent('type-constraint', {
    schema: {

    },

    init: function(): void {
        const initColor = this.el.getAttribute('material').color;

        // Fetch position of the right controller.
        const ctlrPos: Vector3 = new Vector3();
        const r_ctlr: any = document.querySelector('rightHand');
        r_ctlr.object3D.getWorldPosition(ctlrPos);
    },

    tick: function(time, timeDelta): void {
        
    }
});