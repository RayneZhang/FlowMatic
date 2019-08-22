import * as AFRAME from 'aframe'
import { scene, Node, ObjNode, OpNode } from 'frp-backend'
import { objects, CREATE, TRANSLATE } from '../../Objects';
import { resize } from '../../utils/SizeConstraints';
import { Vector3 as THREEVector3} from 'three'

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
        if (this.data.name === TRANSLATE) {
            opNode.pluckInputs().subscribe((input) => {
                console.log("Translate start", input);
                const object: string = input[0];
                const from: THREEVector3 = input[1];
                const to: THREEVector3 = input[2];
                const speed: number = input[3];
                translate(object, from, to, speed);
            });
        }
            
    },

    tick: function(time, timeDelta): void {
        
    }
});

function create(object: string, pos: any): void {
    const el: any = document.createElement('a-entity');
    el.setAttribute('id', `node-${Node.getNodeCount()}`);
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

function translate(object: string, from: THREEVector3, to: THREEVector3, speed: number): void {
    const el: any = document.querySelector(`#${object}`);

    const distance: number = from.distanceTo(to);
    el.setAttribute('animation', {
        property: "position",
        from: {x: from.x, y: from.y, z: from.z},
        to: {x: to.x, y: to.y, z: to.z},
        dur: distance/speed * 1000
    });
}