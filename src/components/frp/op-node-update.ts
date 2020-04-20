import * as AFRAME from 'aframe'
import { scene, Node, ObjNode, OpNode, PupNode } from 'frp-backend'
import { objects, CREATE, TRANSLATE, DESTROY, SNAPSHOT, SUB, COLLIDE, INTERVAL, RANDOM_POS_CUBE } from '../../Objects';
import { resize } from '../../utils/SizeConstraints';
import { Vector3 as THREEVector3, Vector3} from 'three'
import { emitData } from '../../utils/EdgeVisualEffect';
import { run } from '../../utils/App';
import { destroyObj } from '../controllers/right-bbutton-listener';

// This component is used for conducting operations on the front-end (if needed).
export const opNodeUpdate = AFRAME.registerComponent('op-node-update', {
    schema: {
        name: {type: 'string', default: ''},
        inputs: {type: 'array', default: []},
        outputs: {type: 'array', default: []}
    },

    init: function(): void {
        this.el.setAttribute('stored-edges', null);
        
        if (this.data.name === CREATE) {
            const opNode: OpNode = scene.addOp(this.data.name);
            this.el.setAttribute('id', opNode.getID());
            this.subscription = opNode.pluckInputs().subscribe((input) => {
                if (run) {
                    // console.log(input);
                    const object: string = input[0];
                    const pos: any = input[1];
                    create(object, pos, opNode);
                }
            });

            opNode.pluckOutput('object').subscribe((val: any) => {dataTransmit(this.el, val)});
        }
        else if (this.data.name === TRANSLATE) {
            const opNode: OpNode = scene.addOp(this.data.name);
            this.el.setAttribute('id', opNode.getID());
            this.subscription = opNode.pluckInputs().subscribe((input) => {
                if (run) {
                    // console.log("Translate start", input);
                    const object: string = input[0];
                    const from: THREEVector3 = input[1];
                    const to: THREEVector3 = input[2];
                    const speed: number = input[3];
                    // TODO: Translate runs three times when object, from, and to are updated
                    translate(object, from, to, speed, opNode);
                }
            });

            opNode.pluckOutput('end').subscribe((val: any) => {dataTransmit(this.el, val)});
        }
        else if (this.data.name === DESTROY) {
            const opNode: OpNode = scene.addOp(this.data.name);
            this.el.setAttribute('id', opNode.getID());
            this.subscription = opNode.pluckInputs().subscribe((input) => {
                if (run) {
                    // console.log("Destroy start", input);
                    const object: string = input[0];
                    const event: any = input[1];
                    destroy(object, event);
                }
            });

            opNode.pluckOutput('output').subscribe((val: any) => {dataTransmit(this.el, val)});
        }
        else if (this.data.name === SUB) {
            const opNode: OpNode = scene.addOp(this.data.name);
            this.el.setAttribute('id', opNode.getID());
            this.vec1 = new Vector3();
            this.vec2 = new Vector3();
            this.subscription = opNode.pluckInputs().subscribe((input) => {
                if (run) {
                    const vec1: Vector3 = input[0];
                    const vec2: Vector3 = input[1];
                    if (vec1.equals(this.vec1) && vec2.equals(this.vec2)) return;
                    this.vec1 = vec1.clone();
                    this.vec2 = vec2.clone();
                    opNode.updateOutput('output', vec1.clone().sub(vec2.clone()));
                }
            });

            opNode.pluckOutput('output').subscribe((val: any) => {dataTransmit(this.el, val)});
        }
        else if (this.data.name === COLLIDE) {
            // TODO: Add Reactions to Collide.
            const pupNode: PupNode = scene.addPuppet(this.data.name, this.data.inputs, this.data.outputs);
            this.el.setAttribute('id', pupNode.getID());
            this.subscription = pupNode.pluckInputs().subscribe((input) => {
                if (run) {
                    console.log(input);
                    collision(input[0], input[1], pupNode);
                }
            });

            this.data.outputs.forEach((output) => {
                pupNode.pluckOutput(output.name).subscribe((val: any) => {dataTransmit(this.el, val)});
            });
        }
        else if (this.data.name === INTERVAL) {
            const pupNode: PupNode = scene.addPuppet(this.data.name, this.data.inputs, this.data.outputs);
            this.el.setAttribute('id', pupNode.getID());

            this.startTime = Date.now();
            this.subscription = pupNode.pluckInputs().subscribe((input) => {
                if (run) {
                    const signal: string = input[0];
                    const interval: number = input[1];
                    if (Date.now() - this.startTime >= interval) {
                        this.startTime = Date.now();
                        pupNode.updateOutput('event', signal);
                    }
                }
            });
        }
        else if (this.data.name === RANDOM_POS_CUBE) {
            const pupNode: PupNode = scene.addPuppet(this.data.name, this.data.inputs, this.data.outputs);
            this.el.setAttribute('id', pupNode.getID());
            this.worldRandPos = new Vector3();
            this.subscription = pupNode.pluckInputs().subscribe((input) => {
                if (run) {
                    const object: string = input[0];
                    const width: number = input[1];
                    const height: number = input[2];
                    const depth: number = input[3];

                    const randWidth: number = (Math.random() - 0.5) * width;
                    const randHeight: number = (Math.random() - 0.5) * height;
                    const randDepth: number = (Math.random() - 0.5) * depth;

                    const localRandPos: Vector3 = new Vector3(randWidth, randHeight, randDepth);
                    const cubeEl: any = document.getElementById(object);
                    cubeEl.object3D.updateMatrix();
                    cubeEl.object3D.updateWorldMatrix();
                    const worldRandPos: Vector3 = cubeEl.object3D.localToWorld(localRandPos);
                    if (!this.worldRandPos.equals(worldRandPos)) {
                        pupNode.updateOutput('vector3', worldRandPos.clone());
                        this.worldRandPos = worldRandPos.clone();
                    }
                }
            });
        }
        else {
            const opNode: OpNode = scene.addOp(this.data.name);
            this.el.setAttribute('id', opNode.getID());
        }
        
    },

    remove: function(): void {
        if (this.subscription)
            this.subscription.unsubscribe();
    }
});

let obj1set: Array<string> = [];
let obj2set: Array<string> = [];

function collision(object1: string, object2: string, pupNode: PupNode): void {
    console.log(object1);
    console.log(object2);
    // First set bounding box for these two objects.
    const entity1: any = document.querySelector('#' + object1);
    const entity2: any = document.querySelector('#' + object2);

    if (!entity1 || !entity2) {
        return;
    }
    obj1set.push(object1);
    obj2set.push(object2);

    if (entity1.getAttribute('geometry') != undefined) {
        const primitiveName: string = entity1.getAttribute('geometry').primitive;
        if (primitiveName == 'sphere') {
            const radius: number = entity1.getAttribute('geometry').radius;
            entity1.setAttribute('static-body', {
                shape: 'sphere',
                sphereRadius: 0.04
            })
        }
        else if (primitiveName == 'box') {
            const width: number = entity1.getAttribute('geometry').width;
            const height: number = entity1.getAttribute('geometry').height;
            const depth: number = entity1.getAttribute('geometry').depth;
            entity1.setAttribute('static-body', {
                shape: 'sphere',
                sphereRadius: 0.04
            })
        }
    }
    else {
        entity1.setAttribute('static-body', {
            shape: 'sphere',
            sphereRadius: 0.04
        })
    }
    
    entity1.setAttribute('physics-collider', 'ignoreSleep', true);
    entity1.setAttribute('collision-filter', 'collisionForces', false);

    if (entity2.getAttribute('geometry') != undefined) {
        const primitiveName: string = entity2.getAttribute('geometry').primitive;
        if (primitiveName == 'sphere') {
            const radius: number = entity2.getAttribute('geometry').radius;
            entity2.setAttribute('static-body', {
                shape: 'sphere',
                sphereRadius: 0.08
            })
        }
        else if (primitiveName == 'box') {
            const scale: number = entity2.object3D.scale.x;
            entity2.setAttribute('static-body', {
                shape: 'sphere',
                sphereRadius: 0.08,
            })
        }
    }
    else {
        entity2.setAttribute('static-body', {
            shape: 'sphere',
            sphereRadius: 0.08
        })
    }
    
    entity2.setAttribute('physics-collider', 'ignoreSleep', true);
    entity2.setAttribute('collision-filter', 'collisionForces', false);

    entity1.addEventListener('collisions', (e) => {
        console.log("Collisions triggered! " + entity1.getAttribute('id'));
        console.log(e.detail.els);
        if (e.detail.els.length > 0) {
            e.detail.els.forEach((el: any) => {
                if (obj2set.indexOf(el.getAttribute('id')) != -1) {
                    destroyObj(entity1);
                    destroyObj(el);
                }
            });
        }
        console.log(e.detail.clearedEls);
    });
}

function create(object: string, pos: any, opNode: OpNode): void {
    const createdNode = scene.addObj(object, [{name: 'object', default: `node-${Node.getNodeCount()}`}, {name: 'position', default: pos}]);
    const el: any = document.createElement('a-entity');
    el.setAttribute('id', createdNode.getID());
    el.classList.add('dynamic-create');
    const parentEl: any = document.querySelector('#redux');
    parentEl.appendChild(el);

    // Set up geometry and material
    el.setAttribute('geometry', 'primitive', object);

    // Set up position, rotation, and scale
    el.object3D.position.copy(pos);
    if (object == 'box') {
        el.addEventListener('loaded', () => {
            resize(el, 0.1);
        });
    }
    else {
        el.addEventListener('loaded', () => {
            resize(el, 0.05);
        });
    }
    

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
    // console.log(event);
    if (!event) return;
    const targetEl: any = document.querySelector(`#${object}`);
    if (!targetEl) {
        // console.log('Cannot find the target entity at destroy operation.');
        return
    }
    targetEl.parentNode.removeChild(targetEl);
}

function dataTransmit(el: any, val: any): void {
    if (!val) return;
    // Search for the edge...
    const edges = el.getAttribute('stored-edges').outgoingEdges;
    edges.forEach((edgeID: string) => {
        const edgeEl: any = document.querySelector('#'+edgeID);
        if (edgeEl) {
            emitData(edgeEl, edgeEl.getAttribute('line-component').startPoint, edgeEl.getAttribute('line-component').endPoint);
        }
    });
}