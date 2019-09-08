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
        
        this.el.setAttribute('stored-edges', null);
        
        if (this.data.name === CREATE) {
            this.subscription = opNode.pluckInputs().subscribe((input) => {
                console.log(input);
                const object: string = input[0];
                const pos: any = input[1];
                create(object, pos, opNode);
            });
        }
        if (this.data.name === TRANSLATE) {
            this.subscription = opNode.pluckInputs().subscribe((input) => {
                // console.log("Translate start", input);
                const object: string = input[0];
                const from: THREEVector3 = input[1];
                const to: THREEVector3 = input[2];
                const speed: number = input[3];
                translate(object, from, to, speed, opNode);
            });
        }
        if (this.data.name === DESTROY) {
            this.subscription = opNode.pluckInputs().subscribe((input) => {
                // console.log("Destroy start", input);
                const object: string = input[0];
                const event: any = input[1];
                destroy(object, event);
            });
        }
    },

    remove: function(): void {
        if (this.subscription)
            this.subscription.unsubscribe();
    }
});

function create(object: string, pos: any, opNode: OpNode): void {
    const createdNode = scene.addObj(object, [{name: 'object', default: `node-${Node.getNodeCount()}`}, {name: 'position', default: pos}]);
    const el: any = document.createElement('a-entity');
    el.setAttribute('id', createdNode.getID());
    const parentEl: any = document.querySelector('#redux');
    parentEl.appendChild(el);

    // Set up geometry and material
    el.setAttribute('geometry', 'primitive', object);

    // Set up position, rotation, and scale
    el.object3D.position.copy(pos);
    el.addEventListener('loaded', () => {
        resize(el, 0.05);
    });

    // After creating both the node and the entity, emit the nodeID as output
    opNode.updateOutput('object', createdNode.getID());
    // opNode.pluckOutput('object').subscribe((val) => {
    //     console.log("Create output is ", val);
    // });
}

function translate(object: string, from: THREEVector3, to: THREEVector3, speed: number, opNode: OpNode): void {
    const el: any = document.querySelector(`#${object}`);
    const distance: number = from.distanceTo(to);
    if (!el) return;
    el.setAttribute('animation', {
        property: "position",
        from: {x: from.x, y: from.y, z: from.z},
        to: {x: to.x, y: to.y, z: to.z},
        dur: distance/5 * 1000
    });

    // opNode.pluckOutput('end').subscribe((val) => {
    //     console.log("Translate end is ", val);
    // });

    el.addEventListener('animationcomplete', (event) => {
        // console.log("Animation completed!");
        opNode.updateOutput('end', true);
        opNode.updateOutput('end', false);
    });
}

function destroy(object: string, event: any): void {
    console.log(event);
    if (!event) return;
    const targetEl: any = document.querySelector(`#${object}`);
    if (!targetEl) {
        console.log('Cannot find the target entity at destroy operation.');
        return
    }
    targetEl.parentNode.removeChild(targetEl);

    // TODO: Handle the edges associated with the target entity.
}