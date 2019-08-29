import * as AFRAME from 'aframe'
import { scene, Node, ObjNode, OpNode } from 'frp-backend'
import { objects, CREATE, TRANSLATE, DESTROY } from '../../Objects';
import { resize } from '../../utils/SizeConstraints';
import { Vector3 as THREEVector3} from 'three'
import { take } from 'rxjs/operators'

// This component is used for conducting operations on the front-end (if needed).
export const opNodeUpdate = AFRAME.registerComponent('op-node-update', {
    schema: {
        name: {type: 'string', default: ''},
    },

    init: function(): void {
        const opNode: OpNode = this.opNode = scene.addOp(this.data.name);
        this.el.setAttribute('id', opNode.getID());
        
        if (this.data.name === CREATE) {
            opNode.pluckInputs().subscribe((input) => {
                console.log(input);
                const object: string = input[0];
                const pos: any = input[1];
                create(object, pos, opNode);
            });
        }
        if (this.data.name === TRANSLATE) {
            opNode.pluckInputs().subscribe((input) => {
                // console.log("Translate start", input);
                const object: string = input[0];
                const from: THREEVector3 = input[1];
                const to: THREEVector3 = input[2];
                const speed: number = input[3];
                translate(object, from, to, speed, opNode);
            });
        }
        if (this.data.name === DESTROY) {
            opNode.pluckInputs().subscribe((input) => {
                // console.log("Translate start", input);
                const object: string = input[0];
                const event: any = input[1];
                destroy(object, event);
            });
        }
    },

    tick: function(time, timeDelta): void {
        
    }
});

function create(object: string, pos: any, opNode: OpNode): void {
    // console.log(`node-${Node.getNodeCount()}`);
    opNode.pluckOutput('object').pipe(
        take(1)
    ).subscribe((nodeID) => {
        const el: any = document.createElement('a-entity');
        el.setAttribute('id', nodeID);
        const parentEl: any = document.querySelector('#redux');
        parentEl.appendChild(el);

        // Set up geometry and material
        el.setAttribute('geometry', 'primitive', object);

        // Set up position, rotation, and scale
        el.object3D.position.copy(pos);
        el.addEventListener('loaded', () => {
            resize(el, 0.05);
        });
    });
    
}

function translate(object: string, from: THREEVector3, to: THREEVector3, speed: number, opNode: OpNode): void {
    const el: any = document.querySelector(`#${object}`);

    const distance: number = from.distanceTo(to);
    el.setAttribute('animation', {
        property: "position",
        from: {x: from.x, y: from.y, z: from.z},
        to: {x: to.x, y: to.y, z: to.z},
        dur: distance/5 * 1000
    });

    el.addEventListener('animationcomplete', (event) => {
        console.log("Animation completed!");
        opNode.updateOutput('end', true);
        opNode.updateOutput('end', false);
    });
}

function destroy(object: string, event: any): void {
    if (!event) return;
    const targetEl: any = document.querySelector(`#${object}`);
    if (!targetEl) {
        console.log('Cannot find the target entity at destroy operation.');
        return
    }
    targetEl.parentNode.removeChild(targetEl);

    // TODO: Handle the edges associated with the target entity.
}