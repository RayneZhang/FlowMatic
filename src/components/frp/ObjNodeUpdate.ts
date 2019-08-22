import * as AFRAME from 'aframe'
import { scene, Node, ObjNode } from 'frp-backend'

export const objNodeUpdate = AFRAME.registerComponent('obj-node-update', {
    schema: {
        
    },

    init: function(): void {
        this.node = scene.getNode(this.el.getAttribute('id'));
        const label: string = this.node.getLabel();
    },

    tick: function(time, timeDelta): void {
        this.node.update('position', this.el.object3D.position.clone());
    }
});