import * as AFRAME from 'aframe'
import { scene, Node, ObjNode } from 'frp-backend'

export const nodeUpdate = AFRAME.registerComponent('node-update', {
    schema: {
        
    },

    init: function(): void {
        this.node = scene.getNode(this.el.getAttribute('id'));
        const label: string = this.node.getLabel();

        // Let's assume we only update position on every tick now.
    },

    tick: function(time, timeDelta): void {
        this.node.update('position', this.el.object3D.position.clone());
    }
});