import * as AFRAME from 'aframe'
import { scene, Node, ObjNode, OpNode } from 'frp-backend'

export const opNodeUpdate = AFRAME.registerComponent('op-node-update', {
    schema: {
        name: {type: 'string', default: ''},
    },

    init: function(): void {
        const opNode: OpNode = scene.addOp(this.data.name);
        this.el.setAttribute('id', opNode.getID());
        
        opNode.pluckInputs().subscribe((x) => {
            console.log(x);
        });
    },

    tick: function(time, timeDelta): void {
        
    }
});