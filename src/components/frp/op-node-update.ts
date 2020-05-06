import * as AFRAME from 'aframe'
import { scene, Node, ObjNode, OpNode, PupNode } from 'frp-backend'
import { objects, CREATE, TRANSLATE, DESTROY, SNAPSHOT, SUB, COLLIDE, INTERVAL, RANDOM_POS_CUBE, primitiveClass, ANIMATION, EVENT2SIGNAL, STR2NUM, NUM2STR } from '../../Objects';
import { resize, recenter, getRadius, getBox, getBoxWithoutChildren } from '../../utils/SizeConstraints';
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
            const pupNode: PupNode = scene.addPuppet(this.data.name, this.data.inputs, this.data.outputs);
            this.el.setAttribute('id', pupNode.getID());

            this.startTime = Date.now();
            const interval: number = 1000;
            this.subscription = pupNode.pluckInputs().subscribe((input) => {
                if (run) {
                    const _class: string = input[0];
                    const position: any = input[1];
                    const rotation: any = input[2];
                    const scale: any = input[3];
                    const event: boolean = input[4];
                    if (event && (Date.now() - this.startTime >= interval)) {
                        this.startTime = Date.now();
                        create(_class, position, rotation, scale, pupNode);
                    }
                }
            });
        }
        else if (this.data.name === TRANSLATE) {
            const opNode: OpNode = scene.addOp(this.data.name);
            this.el.setAttribute('id', opNode.getID());
            this.object = null;
            this.subscription = opNode.pluckInputs().subscribe((input) => {
                if (run) {
                    // console.log("Translate start", input);
                    const object: string = input[0];
                    const from: THREEVector3 = input[1];
                    const to: THREEVector3 = input[2];
                    const speed: number = input[3];
                    if (object !== this.object) {
                        this.object = object;
                        translate(object, from, to, speed, opNode);
                    }
                }
            });

            opNode.pluckOutput('end').subscribe((val: any) => {dataTransmit(this.el, val)});
        }
        else if (this.data.name === DESTROY) {
            const opNode: OpNode = scene.addOp(this.data.name);
            this.el.setAttribute('id', opNode.getID());
            this.subscription = opNode.pluckInputs().subscribe((input) => {
                if (run) {
                    console.log("Destroy start", input);
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
        else if (this.data.name === ANIMATION) {
            const pupNode: PupNode = scene.addPuppet(this.data.name, this.data.inputs, this.data.outputs);
            this.el.setAttribute('id', pupNode.getID());
            this.startTime = Date.now();
            const interval: number = 1000;
            this.subscription = pupNode.pluckInputs().subscribe((input) => {
                if (run) {
                    console.log("Animation start", input);
                    const object: string = input[0];
                    const animation: string = input[1];
                    if (Date.now() - this.startTime > interval) {
                        this.startTime = Date.now();
                        animate(object, animation);
                    }
                }
            });
        }
        else if (this.data.name === EVENT2SIGNAL) {
            const pupNode: PupNode = scene.addPuppet(this.data.name, this.data.inputs, this.data.outputs);
            this.el.setAttribute('id', pupNode.getID());
            this.subscription = pupNode.pluckInputs().subscribe((input) => {
                if (run) {
                    pupNode.updateOutput('signal', input[0]);
                }
            });
        }
        else if (this.data.name === STR2NUM) {
            const pupNode: PupNode = scene.addPuppet(this.data.name, this.data.inputs, this.data.outputs);
            this.el.setAttribute('id', pupNode.getID());
            this.subscription = pupNode.pluckInputs().subscribe((input) => {
                if (run) {
                    pupNode.updateOutput('number', Number(input[0]));
                }
            });
        }
        else if (this.data.name === NUM2STR) {
            const pupNode: PupNode = scene.addPuppet(this.data.name, this.data.inputs, this.data.outputs);
            this.el.setAttribute('id', pupNode.getID());
            this.subscription = pupNode.pluckInputs().subscribe((input) => {
                if (run) {
                    pupNode.updateOutput('string', String(input[0]));
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
    // First set bounding box for these two objects.
    const entity1: any = document.querySelector('#' + object1);
    const entity2: any = document.querySelector('#' + object2);

    if (!entity1 || !entity2) {
        return;
    }
    obj1set.push(object1);
    obj2set.push(object2);

    const boxSize1 = getBox(entity1);
    entity1.setAttribute('static-body', {
        shape: 'sphere',
        sphereRadius: boxSize1.z / 2
    })
    entity1.setAttribute('physics-collider', 'ignoreSleep', true);
    entity1.setAttribute('collision-filter', 'collisionForces', false);

    const boxSize2 = getBox(entity2);
    entity2.setAttribute('static-body', {
        shape: 'sphere',
        sphereRadius: boxSize2.z / 2
    })
    entity2.setAttribute('physics-collider', 'ignoreSleep', true);
    entity2.setAttribute('collision-filter', 'collisionForces', false);

    entity1.addEventListener('collisions', (e) => {
        console.log("Collisions triggered! " + entity1.getAttribute('id'));
        console.log(e.detail.els);
        if (e.detail.els.length > 0) {
            e.detail.els.forEach((el: any) => {
                if (obj2set.indexOf(el.getAttribute('id')) != -1) {
                    // pupNode.updateOutput('collision-start', true);
                    // pupNode.updateOutput('collision-start', false);

                    // pupNode.updateOutput('collided-object1', entity1.getAttribute('id'));
                    // pupNode.updateOutput('collided-object2', el.getAttribute('id'));
                    destroyObj(entity1);
                    destroyObj(el);

                }
            });
        }
        // console.log(e.detail.clearedEls);
    });
}

function create(_class: string, position: any, rotation: any, scale: any, pupNode: PupNode): void {
    const createdNode = scene.addObj(_class, [{name: 'object', default: `node-${Node.getNodeCount()}`}]);
    const el: any = document.createElement('a-entity');
    const parentEl: any = document.querySelector('#redux');
    parentEl.appendChild(el);
    el.setAttribute('id', createdNode.getID());
    el.classList.add('dynamic-create');

    // If we are creating a primitive shape
    if (primitiveClass.indexOf(_class) != -1) {
        // Set up geometry and material
        el.setAttribute('geometry', 'primitive', _class);

        el.addEventListener('loaded', () => {
            // Set up position, rotation, and scale
            el.object3D.position.copy(position);
            el.object3D.rotation.copy(rotation);
            el.object3D.scale.copy(scale);

            // After creating both the node and the entity, emit the nodeID as output
            pupNode.updateOutput('object', createdNode.getID());
        });
    }
    // If we are creating a sketchfab object
    else {
        // Attach the gltf model.
        el.setAttribute('gltf-model', 'url(' + _class + ')');
        // Resize the model.
        el.addEventListener('model-loaded', () => {
            resize(el, 1.0);
            recenter(el);
            el.object3D.scale.copy(scale);
            el.object3D.position.copy(position);
            el.object3D.rotation.copy(rotation);

            // After creating both the node and the entity, emit the nodeID as output
            pupNode.updateOutput('object', createdNode.getID());
        });
    }
    
    
    createdNode.pluckOutput('object').subscribe((val) => {
        console.log("Create output is ", val);
    });
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
    // console.log(object);
    const targetEl: any = document.getElementById(object);
    if (!targetEl) {
        console.warn('Cannot find the target entity at destroy operation.');
        return;
    }
    destroyObj(targetEl);
}

function animate(object: string, animation: string): void {
    const targetEl: any = document.getElementById(object);
    if (!targetEl) {
        console.warn('Cannot find the target entity at animate operation.');
        return;
    }
    if (targetEl.hasAttribute('animation-mixer'))
        targetEl.removeAttribute('animation-mixer');
    targetEl.setAttribute('animation-mixer', {
        clip: animation,
        loop: 'once',
        timeScale: 0.5
    });
}

function dataTransmit(el: any, val: any): void {
    if (!val) return;
    // Search for the edge...
    const edges = el.getAttribute('stored-edges').outgoingEdges;
    edges.forEach((edgeID: string) => {
        const edgeEl: any = document.querySelector('#'+edgeID);
        if (edgeEl) {
            // emitData(edgeEl, edgeEl.getAttribute('line-component').startPoint, edgeEl.getAttribute('line-component').endPoint);
        }
    });
}