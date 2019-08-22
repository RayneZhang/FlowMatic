import * as AFRAME from 'aframe'
import { scene, Node, ObjNode, OpNode } from 'frp-backend'
import { objects, CREATE } from '../../Objects';
import { resize } from '../../utils/SizeConstraints';

export const opNodeUpdate = AFRAME.registerComponent('op-node-update', {
    schema: {
        name: {type: 'string', default: ''},
    },

    init: function(): void {
        const opNode: OpNode = scene.addOp(this.data.name);
        this.el.setAttribute('id', opNode.getID());
        
        if (this.data.name === CREATE) {
            opNode.pluckInputs().subscribe((input) => {
                const object: string = input[0];
                const pos: any = input[1];
                create(object, pos);
            });
        }
            
    },

    tick: function(time, timeDelta): void {
        
    }
});

function create(object: string, pos: any): void {
    const el: any = document.createElement('a-entity');
    const parentEl: any = document.querySelector('#redux');
    parentEl.appendChild(el);

    // Set up geometry and material
    el.setAttribute('geometry', 'primitive', object);

    // Set up position, rotation, and scale
    el.object3D.position.copy(pos);
    el.addEventListener('loaded', () => {
        resize(el, 0.05);
    });
}